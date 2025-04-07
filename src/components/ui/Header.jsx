import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AiFillBank } from 'react-icons/ai';
import { BiTransfer } from 'react-icons/bi';
import { BsCashStack } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import TransferModal from './TransferModal';
import DepositModal from './DepositModal';
import { IoMdLogOut } from "react-icons/io";

const Headers = ({ isExpanded, setIsExpanded }) => {
    const { user, logout } = useAuth();
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    return (
        <>
               <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`fixed top-0 left-0 h-full bg-blue-900 text-white z-50 transition-all duration-300 ${isExpanded ? 'w-48' : 'w-16'
                }`}
        >
            <div className="flex flex-col h-full">
                <Link to="/" className="flex items-center px-4 py-4 hover:bg-blue-800">
                    <AiFillBank className="text-2xl" />
                    <span className={`ml-3 ${isExpanded ? 'inline' : 'hidden'}`}>Início</span>
                </Link>

                <button
                    onClick={() => setShowDepositModal(true)}
                    className="flex items-center px-4 py-4 hover:bg-blue-800"
                >
                    <BsCashStack className="text-2xl" />
                    <span className={`ml-3 ${isExpanded ? 'inline' : 'hidden'}`}>Depositar</span>
                </button>

                <button
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center px-4 py-4 hover:bg-blue-800"
                >
                    <BiTransfer className="text-2xl" />
                    <span className={`ml-3 ${isExpanded ? 'inline' : 'hidden'}`}>Transferir</span>
                </button>

                <div className="mt-auto px-4 py-4 border-t border-blue-800 flex items-center justify-between">
                    <div className={`${isExpanded ? 'block' : 'hidden'} text-md`}>
                        <span>{user?.name}</span>
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
