import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">
                    תשבצי דיגיטל
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Main navigation links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/wordlists">
                                רשימות מילים
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-crosswords">
                                        התשבצים שלי
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-wordlists">
                                        רשימות המילים שלי
                                    </Link>
                                </li>
                                {/* Creation links - no longer in a dropdown */}
                                {user.isContentCreator && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/create-crossword">
                                                יצירת תשבץ
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/create-wordlist">
                                                יצירת רשימת מילים
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    {/* User-related links */}
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                {/* User's name links to profile */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        {user.name}
                                    </Link>
                                </li>
                                {/* Logout button */}
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link" // styled as a link
                                        onClick={handleLogout}
                                    >
                                        התנתק
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        התחבר
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        הירשם
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;