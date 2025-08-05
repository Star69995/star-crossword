import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    תשבצי דיגיטל
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">דף הבית</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/wordlists">רשימות מילים</Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-crosswords">התשבצים שלי</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-wordlists">רשימות המילים שלי</Link>
                                </li>
                                {user.isContentCreator && (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                            יצירה
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/create-crossword">יצירת תשבץ</Link></li>
                                            <li><Link className="dropdown-item" to="/create-wordlist">יצירת רשימת מילים</Link></li>
                                        </ul>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        {user ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    {user.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/profile">פרופיל</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>התנתק</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">התחבר</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">הירשם</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar