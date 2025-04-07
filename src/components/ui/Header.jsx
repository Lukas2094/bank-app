import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AiFillBank } from 'react-icons/ai';
import { BiTransfer } from 'react-icons/bi';
import { BsCashStack } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import TransferModal from './TransferModal';
import DepositModal from './DepositModal';
import { IoMdLogOut } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const Headers = ({ isExpanded, setIsExpanded }) => {
    const { user, logout } = useAuth();
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserName, setShowUserName] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowUserName(true);
        }, 1500);
        setShowUserName(false);
        return () => clearTimeout(timer);
    }, []);

    const handleMobileToggle = () => {
        setShowMobileMenu(prev => !prev);
    };

    return (
        <>
            {isMobile && (
                <div className='w-full bg-blue-500 h-16 p-3 fixed'>
                <button
                    onClick={handleMobileToggle}
                        className="left-10 z-50 text-white bg-blue-500 p-2 rounded-md"
                >
                    <GiHamburgerMenu size={24} />
                </button>
                </div>
                
            )}

            {/* Sidebar */}
            {(isMobile ? showMobileMenu : true) && (
                <aside
                    onMouseEnter={() => !isMobile && setIsExpanded(true)}
                    onMouseLeave={() => !isMobile && setIsExpanded(false)}
                    className={`fixed top-0 left-0 h-full bg-blue-900 text-white z-40
                    transition-all duration-500 ease-in-out
                    transform ${isMobile ? 'w-9/12 mt-16 p-3' : isExpanded ? 'w-48' : 'w-16'}
                    ${isMobile ? (showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none') : 'opacity-100'}
                `}
                >
                    <div className="flex flex-col h-full">
                        <Link to="/" className="flex items-center px-4 py-4 hover:bg-blue-800">
                            <AiFillBank className="text-2xl" />
                            <span className={`ml-3 ${isExpanded || isMobile ? 'inline' : 'hidden'}`}>Início</span>
                        </Link>

                        <button
                            onClick={() => setShowDepositModal(true)}
                            className="flex items-center px-4 py-4 hover:bg-blue-800"
                        >
                            <BsCashStack className="text-2xl" />
                            <span className={`ml-3 ${isExpanded || isMobile ? 'inline' : 'hidden'}`}>Depositar</span>
                        </button>

                        <button
                            onClick={() => setShowTransferModal(true)}
                            className="flex items-center px-4 py-4 hover:bg-blue-800"
                        >
                            <BiTransfer className="text-2xl" />
                            <span className={`ml-3 ${isExpanded || isMobile ? 'inline' : 'hidden'}`}>Transferir</span>
                        </button>

                        <div className={`${!isMobile ? 'mt-auto' : ''} px-4 py-4 border-t border-blue-800 flex items-center justify-between`}>
                            <div className={`${isExpanded || isMobile ? 'block' : 'hidden'} text-md`}>
                                {showUserName && <span>{user?.name}</span>}
                            </div>
                            <div className="relative group">
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-1 py-1 text-sm rounded"
                                >
                                    <IoMdLogOut />
                                </button>
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-50">
                                    Logout
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Modals */}
            {showDepositModal && (
                <DepositModal onClose={() => setShowDepositModal(false)} />
            )}

            {showTransferModal && (
                <TransferModal onClose={() => setShowTransferModal(false)} />
            )}
        </>
    );
};

export default Headers;
