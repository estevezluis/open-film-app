import image from '../assets/icon.png'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function AddFilm() {
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Email is not valid')
				.required('Email is required'),
			password: Yup.string().required('Password is required'),
		}),
		onSubmit: (values) => {
			console.log(values)
		},
	})

	const labelStyle = 'block text-sm font-medium text-gray-700'
	const inputStyle =
		'w-full border-gray-400 rounded-lg shadow-sm focus:border-gray-500 ring-2 focus:ring-gray-50 py-2 px-3'
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="text-center">
					<img
						className="mx-auto h-12 w-auto inline-block"
						src={image}
						alt="Logo"
					/>
					Open Film
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600 max-w">
					Already registered?&nbsp;
					<a
						href="/register"
						className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Sign in
					</a>
				</p>
			</div>
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
					<form
						className="mb-0 space-y-6"
						onSubmit={formik.handleSubmit}
					>
						<div>
							<label className={labelStyle} htmlFor="email">
								Email Address
							</label>
							<input
								className={inputStyle}
								type="email"
								name="email"
								id="email"
								required
								value={formik.values.email}
								onChange={formik.handleChange}
							/>
							{formik.touched.email && formik.errors.email && (
								<div>{formik.errors.email}</div>
							)}
						</div>

						<div>
							<label className={labelStyle} htmlFor="password">
								Password
							</label>
							<input
								className={inputStyle}
								type="password"
								name="password"
								id="password"
								required
								value={formik.values.password}
								onChange={formik.handleChange}
							/>
							{formik.touched.password &&
								formik.errors.password && (
									<div>{formik.errors.password}</div>
								)}
						</div>
						<button
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							type="submit"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
