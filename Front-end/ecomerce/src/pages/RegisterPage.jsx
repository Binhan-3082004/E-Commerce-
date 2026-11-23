import { Link } from 'react-router-dom'
import { register as registerApi } from '../services/api.js'
import { useNavigate } from 'react-router-dom';
import { showAlert } from "../components/ui/Alert";

export function RegisterPage() {
    const navigate = useNavigate();

    async function submit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name')
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password')
        const role = "buyer"
        if (password !== confirmPassword) {
            showAlert("Vui lòng xác nhận lại mk", "error")
            return;
        }
        try {
            const result = await registerApi(name, email, password, role);
            if (result) {
                showAlert("Đăng kí thành công", "success");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        }
        catch (error) {
            showAlert(error.message, "error")
        }

    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto min-h-screen lg:py-0">

                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1
                            className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                            <div>
                                <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User
                                    Name</label>
                                <input type="text" name="name" id="Name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Username" required=""></input>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@vmo.com" required=""></input>
                            </div>
                            <div>
                                <label htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""></input>
                            </div>
                            <div>
                                <label htmlFor="confirm-password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                    password</label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""></input>
                            </div>

                            <button type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200">
                                Create
                                account</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link to="/login"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500">Login
                                    here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}