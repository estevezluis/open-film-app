import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowRotateLeft, faArrowRotateRight, faXmark, faExpand, faCompress, faCirclePlay, faCirclePause, faVolumeUp
} from '@fortawesome/free-solid-svg-icons'
import { Movie, Episode } from '../types'

const SEEK_BY_SECONDS = 15
const DELAY_MENU_BY_SECONDS = 1
const menuButtonClassName = "opacity-25 hover:opacity-100 hover:cursor"
const menuButtonIconStyle = { color: 'white', fontSize: '50px' }

export default function VideoPlayer({film, onClose }: {film: Movie | Episode, onClose: Function}) {
	const videoContainerRef = useRef<HTMLDivElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const [showMenu, setShowMenu] = useState(true)
	const [videoStats, setVideoStats] = useState({
		currentTime: 0, duration: 0, fullscreen: false, paused: true, progress: 0
	})

	useEffect(() => {
		let timeoutId: number
		const videoElement = videoRef.current

		function showHideMenu() {
			setShowMenu(true)
			window.clearTimeout(timeoutId)
			timeoutId = window.setTimeout(() => {
				setShowMenu(false)
			}, DELAY_MENU_BY_SECONDS * 1000)
		}

		window.addEventListener('mousemove', showHideMenu)
		videoElement?.addEventListener('loadeddata', loaded)
		videoElement?.addEventListener('timeupdate', timeUpdate)
		videoElement?.addEventListener('play', play)
		videoElement?.addEventListener('pause', pause)

		return () => {
			window.removeEventListener('mousemove', showHideMenu)
			videoElement?.removeEventListener('timeupdate', timeUpdate)
			videoElement?.removeEventListener('play', play)
			videoElement?.removeEventListener('pause', pause)
			window.clearTimeout(timeoutId)
		}
	}, [])

	function loaded(): void {
		setVideoStats((prev) => {
			return {...prev, duration: videoRef.current?.duration ?? prev.duration}
		})
	}

	function timeUpdate(event: Event): void {
		setVideoStats((prev) => {
			const currentTime = videoRef.current?.currentTime ?? prev.currentTime
			const progress = (currentTime / prev.duration) * 100
			return { ...prev, currentTime, progress }
		})
	}

	function play(): void {
		setVideoStats((prev) => {
			return {...prev, paused: false}
		})
	}

	function pause(): void {
		setVideoStats((prev) => {
			return {...prev, paused: true}
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

	function fullScreenBtnClicked() { }

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

	return (
		<div ref={videoContainerRef} className="flex flex-col justify-between h-screen">
			<video ref={videoRef} className="-z-10 absolute inset-0 w-full h-full object-cover bg-black" src={`http://localhost:8000/${film.videoSource}`}></video>
			{showMenu &&
				<div className="absolute inset-0" style={{
					background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)',
					backgroundColor: 'rgba(0, 0, 0, 0.25)',
					opacity: 1,
					transition: 'opacity 150ms ease-in'
				}}>
				</div>
			}
			{showMenu &&
				<div className="z-20 flex flex-col justify-between h-screen">
					<div className="flex justify-end gap-10 py-4 px-6">
						<button className={menuButtonClassName}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={faVolumeUp} />
						</button>
						<button onClick={fullScreenBtnClicked} className={menuButtonClassName}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={videoStats.fullscreen ? faCompress : faExpand} />
						</button>
						<button onClick={closePlayerBtnClicked} className={menuButtonClassName}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={faXmark} />
						</button>
					</div>
					<div className="text-center text-3xl text-white">
						<h1>{film.title}</h1>
					</div>
					<div className="flex justify-center gap-36 items-center h-screen">
						<button className={menuButtonClassName} onClick={seekBackward}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={faArrowRotateLeft} />
						</button>
						<button className={menuButtonClassName} onClick={videoControlButtonClicked}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={videoStats.paused ? faCirclePlay : faCirclePause} />
						</button>
						<button className={menuButtonClassName} onClick={seekForward}>
							<FontAwesomeIcon style={menuButtonIconStyle} icon={faArrowRotateRight} />
						</button>
					</div>
					<div className="px-6 pb-5">
						<input type="range" min="1" max="100" value={`${videoStats.progress}`} step="any" className="w-full slider hover:cursor-pointer" style={{
							background: `linear-gradient(90deg, white 0% ${videoStats.progress}%, rgba(225, 225, 225, 0.5) ${videoStats.progress}% 100%)`
						}} onChange={sliderOnChange} />
						<div>
							<span className="mr-2 text-white">{formatTime(videoStats.currentTime)}</span>
							<span className="ml-2 text-slate-300">{formatTime(videoStats.duration)}</span>
						</div>
					</div>
				</div>
			}
		</div>
	)
}
