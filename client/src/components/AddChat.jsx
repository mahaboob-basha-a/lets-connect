import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { searchUserByEmail } from "../server/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AddChat = ({ onSelectUser }) => {
    const [email, setEmail] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        setSearchResult(null);
        if(!email.endsWith("@gmail.com")){
            return toast.error("User not found");
        }
        try {
            const searchedUser = await searchUserByEmail(email);
            if (searchedUser) {
                setSearchResult(searchedUser?.data?.user);
            }else{
                toast.error("User not found")
            }
        } catch (error) {
            return toast.error("User not found");
        };
        }

    return (
        <section className="flex bg-neutral-200">
            <Sidebar />
            <div className="w-screen h-screen flex items-start justify-center py-10">
            <div className="p-4 shadow-md rounded-md bg-white">
                <div className=" flex items-center gap-2">
                <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 outline-none p-2 w-full rounded-md border-gray-300"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
                Search
                </button>
                </div>

                {searchResult && (
                <div className="mt-4">
                    <p className="py-4">Found: {searchResult.email}</p>
                    <Link
                        to={`/chat/${searchResult._id}`}
                        className="bg-green-500 text-white p-2 mt-2 rounded-md"
                        >
                        Start Chat
                    </Link>
                </div>
                )}
            </div>
            </div>
        </section>
    );
};

export default AddChat;
