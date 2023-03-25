import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick'
import { Film } from '../types'

export default function Collection({films} : {films: Film[]}) {
    const settings = {
        data: true,
        center: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
    }
    const movies = [...films, ...films, ...films]

    return (
        <div className="bg-gray-900 w-screen h-screen p-2 text-white overflow-hidden">
            <div className="px-4 sm:px-8 md:px-12 xl:px-16 max-w-full">
                <section className="mb-12">
                    <h3 className="transition-opacity duration-500 opacity-100 font-bold text-2xl !leading-[1.25] font-whitney mb-3 md:mb-4 p-0 -tracking-[0.01em] text-white">Short Animations</h3>
                    <Slider {...settings}>
                        {movies.map(({ id, imageSource, title }, i) => {
                            return <div key={i}>
                                <Link to={`/watch/${id}`}>
                                    <div className="relative rounded-lg cursor-pointer h-44 w-72 overflow-hidden duration-[400ms] ease-in-out mb-3">
                                        <img src={`http://localhost:8000/${imageSource}`} alt={title} className="object-cover absolute inset-0 w-full h-full rounded-lg" />
                                        <div className="absolute inset-0 bg-[#00000088] hover:opacity-100 opacity-0 hover:ease-in-out hover:duration-500">
                                            <div className="flex w-full h-full justify-center items-center text-white">
                                                <FontAwesomeIcon icon={faCirclePlay} size="2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to={`/watch/${id}`}><p>{title}</p></Link>
                            </div>
                        })}
                    </Slider>
                </section>
            </div>
        </div>
    )
}