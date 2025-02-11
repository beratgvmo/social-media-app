import React from "react";
import { GitHubRepo, GitHubUser } from "@/types";
import {
    TbExternalLink,
    TbBook2,
    TbFile,
    TbStar,
    TbClipboardPlus,
    TbX,
} from "react-icons/tb";

export const GithubUserView: React.FC<{
    user: GitHubUser;
    handleGithub?: (value: GitHubUser | null, type: string) => void;
    handleGithubApi?: (value: string) => void;
    button?: boolean;
    handleGithubDelete?: () => void;
    deleteBtn?: boolean;
}> = ({
    user,
    handleGithub,
    handleGithubApi,
    button = true,
    handleGithubDelete,
    deleteBtn = true,
}) => (
    <div className="border p-4 rounded bg-white flex justify-between">
        <div className="flex gap-4">
            <div>
                <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-24 h-24 mx-auto rounded-full border"
                />
            </div>
            <div>
                <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer group"
                >
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-medium">{user.name}</p>
                        <p className="text-gray-500 text-sm">@{user.login}</p>
                    </div>
                </a>
                {user.bio && (
                    <p className="text-gray-700 mt-0.5 text-sm">{user.bio}</p>
                )}
                {user.location && (
                    <p className="text-xs text-gray-500 mt-0.5">
                        {user.location}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Takipçiler: {user.followers} · Takip Edilen:{" "}
                    {user.following}
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            {button && (
                <div>
                    <button
                        onClick={() => {
                            handleGithubApi(user.url);
                            handleGithub(user, "user");
                        }}
                    >
                        <TbClipboardPlus className="text-3xl p-1 rounded-md transition hover:bg-gray-200 text-orange-500 hover:text-orange-600" />
                    </button>
                </div>
            )}
            {deleteBtn && (
                <div>
                    <button
                        onClick={() => {
                            handleGithubDelete();
                        }}
                    >
                        <TbX className="text-3xl p-1 rounded-md transition hover:bg-gray-200 text-red-500 hover:text-red-600" />
                    </button>
                </div>
            )}
            <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer group"
            >
                <TbExternalLink className="text-3xl p-1 rounded-md transition group-hover:bg-gray-200 text-blue-500 hover:text-blue-600" />
            </a>
        </div>
    </div>
);

export const GithubRepoView: React.FC<{
    repo: GitHubRepo;
    handleGithub?: (value: GitHubRepo | null, type: string) => void;
    handleGithubApi?: (value: string) => void;
    handleGithubDelete?: () => void;
    button?: boolean;
    deleteBtn?: boolean;
}> = ({
    repo,
    handleGithub,
    handleGithubApi,
    button = true,
    deleteBtn = true,
    handleGithubDelete,
}) => (
    <div className="border px-4 py-3 rounded bg-white mx-1 flex justify-between">
        <div>
            <div className="flex items-center gap-1.5">
                <TbBook2 className="text-gray-800" />
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-blue-600 hover:underline"
                >
                    <p className="text-blue-600 font-medium">
                        {repo.full_name}
                    </p>
                </a>
            </div>
            <p className="text-gray-600 mt-1 mb-2 text-sm">
                {repo.description}
            </p>
            <div className="flex gap-8 mt-2">
                <p className="flex items-center justify-center text-xs text-gray-600 gap-0.5">
                    <TbFile /> {repo.language}
                </p>
                <p className="flex items-center justify-center text-xs text-gray-600 gap-0.5">
                    <TbStar /> {repo.stargazers_count}
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            {button && (
                <div>
                    <button
                        onClick={() => {
                            handleGithubApi(repo.url);
                            handleGithub(repo, "repo");
                        }}
                    >
                        <TbClipboardPlus className="text-3xl p-1 rounded-md transition hover:bg-gray-200 text-orange-500 hover:text-orange-600" />
                    </button>
                </div>
            )}
            {deleteBtn && (
                <div>
                    <button
                        onClick={() => {
                            handleGithubDelete();
                        }}
                    >
                        <TbX className="text-3xl p-1 rounded-md transition hover:bg-gray-200 text-red-500 hover:text-red-600" />
                    </button>
                </div>
            )}
            <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer group"
            >
                <TbExternalLink className="text-3xl p-1 rounded-md transition group-hover:bg-gray-200 text-blue-500 hover:text-blue-600" />
            </a>
        </div>
    </div>
);
