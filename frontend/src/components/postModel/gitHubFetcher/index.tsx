import { FC, useState } from "react";
import axios from "axios";
import Modal from "@/components/Modal";

interface GitHubFetcherProps {
    isOpen: boolean;
    onClose: () => void;
}

const GitHubFetcher: FC<GitHubFetcherProps> = ({ isOpen, onClose }) => {
    const [searchState, setSearchState] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [repos, setRepos] = useState<any[]>([]);
    const [error, setError] = useState("");

    const searchGithub = async () => {
        setError("");
        setUserData(null);
        setRepos([]);

        if (!searchState.trim()) {
            setError("Lütfen bir kullanıcı adı veya repo adı girin.");
            return;
        }

        try {
            if (searchState.includes("/")) {
                const [username, reponame] = searchState.split("/");

                const repoResponse = await axios.get(
                    `https://api.github.com/repos/${username}/${reponame}`
                );

                setRepos([repoResponse.data]);
            } else {
                const userResponse = await axios.get(
                    `https://api.github.com/users/${searchState}`
                );

                setUserData(userResponse.data);
            }
        } catch (err) {
            setError("Bilgi bulunamadı veya geçersiz kullanıcı/repo adı.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="GitHub Bilgileri"
            maxWidth="2xl"
        >
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                    GitHub Kullanıcı & Repo Getir
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="GitHub Kullanıcı Adı veya kullanıcıadı/repoadı"
                        value={searchState}
                        onChange={(e) => setSearchState(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={searchGithub}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Ara
                    </button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}

                {userData && (
                    <div className="border p-4 rounded text-center mt-4">
                        <img
                            src={userData.avatar_url}
                            alt={userData.login}
                            className="w-24 h-24 mx-auto rounded-full border"
                        />
                        <h3 className="text-lg font-bold mt-2">
                            {userData.name || userData.login}
                        </h3>
                        <p className="text-gray-600">@{userData.login}</p>
                        <p>{userData.bio || "Biyografi yok"}</p>
                        <p className="text-sm text-gray-600">
                            📌 Lokasyon: {userData.location || "Belirtilmemiş"}
                        </p>
                        <p className="text-sm text-gray-600">
                            📌 Takipçiler: {userData.followers} | Takip Edilen:{" "}
                            {userData.following}
                        </p>
                        <a
                            href={userData.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            Profili Görüntüle
                        </a>
                    </div>
                )}

                {repos.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">📂 Repositories</h3>
                        <ul className="list-disc pl-4 space-y-2">
                            {repos.map((repo) => (
                                <li key={repo.id}>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {repo.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default GitHubFetcher;
