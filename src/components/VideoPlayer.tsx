import { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowRotateLeft,
	faArrowRotateRight,
	faXmark,
	faExpand,
	faCompress,
	faCirclePlay,
	faCirclePause,
	faVolumeHigh,
	faVolumeLow,
	faVolumeOff,
} from '@fortawesome/free-solid-svg-icons'
import { Movie, Episode } from '../types'

const SEEK_BY_SECONDS = 15
const DELAY_MENU_BY_SECONDS = 1
const menuButtonClassName = 'opacity-25 hover:opacity-100 hover:cursor'
const menuButtonIconStyle = { color: 'white', fontSize: '50px' }

export default function VideoPlayer({
	film,
	onClose,
}: {
	film: Movie | Episode
	onClose: Function
}) {
	const videoContainerRef = useRef<HTMLDivElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const [showMenu, setShowMenu] = useState(true)
	const [showVolumeControl, setShowVolumeControl] = useState(false)
	const [videoStats, setVideoStats] = useState({
		currentTime: 0,
		duration: 0,
		fullscreen: false,
		paused: true,
		progress: 0,
		buffered: 0,
		volume: 100,
	})

	useEffect(() => {
		let timeoutId: number
		const videoElement = videoRef.current

		function showHideMenu() {
			setShowMenu(true)
			window.clearTimeout(timeoutId)
			timeoutId = window.setTimeout(() => {
				setShowMenu(false)
				setShowVolumeControl(false)
			}, DELAY_MENU_BY_SECONDS * 1000)
		}

		window.addEventListener('mousemove', showHideMenu)
		window.addEventListener('keydown', onKeyDown)
		videoElement?.addEventListener('loadeddata', loaded)
		videoElement?.addEventListener('timeupdate', timeUpdate)
		videoElement?.addEventListener('progress', onProgress)
		videoElement?.addEventListener('play', play)
		videoElement?.addEventListener('pause', pause)
		videoElement?.addEventListener('volumechange', onVolumeChangeEvent)

		const hls = new Hls()
		hls.loadSource(
			`${process.env.REACT_APP_SERVER_URL}/${film.videoSource}`
		)
		hls.attachMedia(videoElement as HTMLMediaElement)

		return () => {
			window.removeEventListener('mousemove', showHideMenu)
			window.removeEventListener('keydown', onKeyDown)
			videoElement?.removeEventListener('timeupdate', timeUpdate)
			videoElement?.removeEventListener('progress', onProgress)
			videoElement?.removeEventListener('play', play)
			videoElement?.removeEventListener('pause', pause)
			videoElement?.removeEventListener(
				'volumechange',
				onVolumeChangeEvent
			)
			window.clearTimeout(timeoutId)
		}
	}, [film.videoSource])

	function onKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case 'KeyF':
				fullScreenBtnClicked()
				break
			case 'Space':
				videoControlButtonClicked()
				break
			case 'ArrowLeft':
				seekBackward()
				break
			case 'ArrowRight':
				seekForward()
				break
			default:
				break
		}

		e.preventDefault()
	}

	function onProgress(): void {
		if (videoRef.current) {
			const { current: video } = videoRef
			const buffered = video.buffered.length ? video.buffered.end(0) : 0
			const duration = video.duration // Get the total duration of the video
			const bufferedPercent = (buffered / duration) * 100 // Calculate the buffered percentage
			setVideoStats((prev) => {
				return {
					...prev,
					buffered: bufferedPercent,
				}
			})
		}
	}

	function loaded(): void {
		setVideoStats((prev) => {
			return {
				...prev,
				duration: videoRef.current?.duration ?? prev.duration,
			}
		})
	}

	function timeUpdate(): void {
		setVideoStats((prev) => {
			const currentTime =
				videoRef.current?.currentTime ?? prev.currentTime
			const progress = (currentTime / prev.duration) * 100
			return { ...prev, currentTime, progress }
		})
	}

	function play(): void {
		setVideoStats((prev) => {
			return { ...prev, paused: false }
		})
	}

	function pause(): void {
		setVideoStats((prev) => {
			return { ...prev, paused: true }
		})
	}

	function seekForward(): void {
		if (videoRef.current) {
			videoRef.current.currentTime += SEEK_BY_SECONDS
		}
	}

	function seekBackward(): void {
		if (videoRef.current) {
			videoRef.current.currentTime -= SEEK_BY_SECONDS
		}
	}

	function formatTime(timeInSeconds: number): string {
		const roundedSeconds = timeInSeconds | 0

		const minutes = ((roundedSeconds / 60) | 0).toString().padStart(2, '0')
		const seconds = (roundedSeconds % 60).toString().padStart(2, '0')

		return `${minutes}:${seconds}`
	}

	function sliderOnChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = Number(e.currentTarget.value)

		if (videoRef.current) {
			const newTime = (val / 100) * videoRef.current.duration

			videoRef.current.currentTime = newTime
		}
	}

	async function fullScreenBtnClicked() {
		if (videoContainerRef.current) {
			let fullscreen = false
			if (videoStats.fullscreen) {
				document.exitFullscreen()
			} else {
				await videoContainerRef.current.requestFullscreen()
				fullscreen = true
			}

			setVideoStats((prev) => {
				return { ...prev, fullscreen }
			})
		}
	}

	function closePlayerBtnClicked() {
		onClose()
	}

	function videoControlButtonClicked() {
		if (videoRef.current) {
			if (videoRef.current.paused) {
				videoRef.current.play()
			} else {
				videoRef.current.pause()
			}
		}
	}

	function volumeBtnClick() {
		setShowVolumeControl((prev) => !prev)
	}

	function onVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = Number(e.currentTarget.value) / 100

		if (videoRef.current) {
			videoRef.current.volume = val
		}
	}

	function onVolumeChangeEvent() {
		const val = Number(videoRef.current?.volume ?? 0) * 100

		setVideoStats((prev) => {
			return { ...prev, volume: val }
		})
	}

	return (
		<div
			ref={videoContainerRef}
			className="flex flex-col justify-between h-screen"
		>
			<video
				ref={videoRef}
				className="-z-10 absolute inset-0 w-full h-full object-cover bg-black"
			></video>
			{showMenu && (
				<div
					className="absolute inset-0"
					style={{
						background:
							'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)',
						backgroundColor: 'rgba(0, 0, 0, 0.25)',
						opacity: 1,
						transition: 'opacity 150ms ease-in',
					}}
				></div>
			)}
			{showMenu && (
				<div className="z-20 flex flex-col justify-between h-screen">
					<div className="flex justify-end gap-10 py-4 px-6">
						<div className="w-16">
							<span>
								<button
									className={menuButtonClassName + ' block'}
									onClick={volumeBtnClick}
								>
									<FontAwesomeIcon
										style={menuButtonIconStyle}
										icon={
											videoStats.volume > 35
												? faVolumeHigh
												: videoStats.volume > 0
												? faVolumeLow
												: faVolumeOff
										}
									/>
								</button>
								<div className="relative">
									<div
										className={
											'absolute h-56 w-16 bg-gray-900 z-100' +
											(!showVolumeControl
												? ' hidden'
												: '')
										}
									>
										<input
											className="-rotate-90 translate-y-[500%] -translate-x-[32.25%]"
											type="range"
											onChange={onVolumeChange}
											value={videoStats.volume}
										/>
									</div>
								</div>
							</span>
						</div>
						<button
							onClick={fullScreenBtnClicked}
							className={menuButtonClassName}
						>
							<FontAwesomeIcon
								style={menuButtonIconStyle}
								icon={
									videoStats.fullscreen
										? faCompress
										: faExpand
								}
							/>
						</button>
						<button
							onClick={closePlayerBtnClicked}
							className={menuButtonClassName}
						>
							<FontAwesomeIcon
								style={menuButtonIconStyle}
								icon={faXmark}
							/>
						</button>
					</div>
					<div className="text-center text-3xl text-white">
						<h1>{film.title}</h1>
					</div>
					<div className="flex justify-center gap-36 items-center h-screen">
						<button
							className={menuButtonClassName}
							onClick={seekBackward}
						>
							<FontAwesomeIcon
								style={menuButtonIconStyle}
								icon={faArrowRotateLeft}
							/>
						</button>
						<button
							className={menuButtonClassName}
							onClick={videoControlButtonClicked}
						>
							<FontAwesomeIcon
								style={menuButtonIconStyle}
								icon={
									videoStats.paused
										? faCirclePlay
										: faCirclePause
								}
							/>
						</button>
						<button
							className={menuButtonClassName}
							onClick={seekForward}
						>
							<FontAwesomeIcon
								style={menuButtonIconStyle}
								icon={faArrowRotateRight}
							/>
						</button>
					</div>
					<div className="px-6 pb-5">
						<input
							type="range"
							min="1"
							max="100"
							value={`${videoStats.progress}`}
							step="any"
							className="w-full slider hover:cursor-pointer"
							style={{
								background: `linear-gradient(90deg, white 0% ${videoStats.progress}%, rgba(123, 123, 123, 0.75) ${videoStats.progress}% ${videoStats.buffered}%, rgba(225, 225, 225, 0.5) ${videoStats.buffered}% 100%)`,
							}}
							onChange={sliderOnChange}
						/>
						<div>
							<span className="mr-2 text-white">
								{formatTime(videoStats.currentTime)}
							</span>
							<span className="ml-2 text-slate-300">
								{formatTime(videoStats.duration)}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
