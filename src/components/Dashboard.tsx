import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/icon.png'

export default function Dashboard() {
	return (
		<div className="">
			<nav className="flex justify-between items-center h-16 bg-gray-200 text-white">
				<div className="flex items-center text-black ml-4">
					<img src={logo} alt="Logo" className="h-8"></img>
					Open Film
				</div>
				<div className="flex items-center mr-4">
					<a
						href="/add-film"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md mr-2"
					>
						<FontAwesomeIcon icon={faPlus} />
						&nbsp;Add Film
					</a>
					<button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">
						Logout
					</button>
				</div>
			</nav>
		</div>
	)
}
