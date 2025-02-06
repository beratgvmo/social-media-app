import { FC, useState } from "react";
import axios from "axios";
import Modal from "@/components/Modal";
import {
    TbBook2,
    TbClipboardPlus,
    TbExternalLink,
    TbFile,
    TbSearch,
    TbStar,
} from "react-icons/tb";
import { CgSpinner } from "react-icons/cg";
import { GitHubRepo, GitHubUser } from "@/types";
import { GithubRepoView, GithubUserView } from "../githubRepoView";

interface GitHubFetcherProps {
    isOpen: boolean;
    onClose: () => void;
    handleGithub: (value: GitHubUser | GitHubRepo | null, type: string) => void;
    handleGithubApi: (value: string) => void;
}

const GitHubFetcher: FC<GitHubFetcherProps> = ({
    isOpen,
    onClose,
    handleGithub,
    handleGithubApi,
}) => {
    const [searchState, setSearchState] = useState("");
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [repo, setRepo] = useState<GitHubRepo | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const searchGithub = async () => {
        setError("");
        setUser(null);
        setRepo(null);
        setLoading(true);

        if (!searchState.trim()) {
            setError("Lütfen bir kullanıcı adı veya repo adı girin.");
            setLoading(false);
            return;
        }

        try {
            if (searchState.includes("/")) {
                const [username, reponame] = searchState.split("/");

                const repoResponse = await axios.get(
                    `https://api.github.com/repos/${username}/${reponame}`
                );

                setRepo(repoResponse.data);
            } else {
                const userResponse = await axios.get(
                    `https://api.github.com/users/${searchState}`
                );

                setUser(userResponse.data);
            }
        } catch (err) {
            setError("Bilgi bulunamadı veya geçersiz kullanıcı/repo adı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="GitHub Bilgileri"
            maxWidth="xl"
        >
            <div className="p-4">
                <div className="flex mb-3">
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı/repo adı"
                        value={searchState}
                        onChange={(e) => setSearchState(e.target.value)}
                        className="bg-white border-2 border-gray-300 border-r-0 text-gray-900 transition-all text-sm rounded-s-lg block w-full p-2.5 outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={searchGithub}
                        className="px-4 py-2 bg-blue-500 border-blue-500 text-white rounded-e-lg hover:bg-blue-600 transition"
                    >
                        <TbSearch />
                    </button>
                </div>

                {error && (
                    <p className="text-red-500 mt-1 ml-1 text-xs">{error}</p>
                )}

                {user && (
                    <GithubUserView
                        user={user}
                        handleGithub={handleGithub}
                        handleGithubApi={handleGithubApi}
                    />
                )}

                {repo && (
                    <GithubRepoView
                        repo={repo}
                        handleGithub={handleGithub}
                        handleGithubApi={handleGithubApi}
                    />
                )}

                {loading && (
                    <div className="w-full flex justify-center items-center h-20">
                        <CgSpinner
                            className="animate-spin text-blue-600"
                            size={45}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default GitHubFetcher;
