export interface GitHubUser {
    avatar_url: string;
    login: string;
    name: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    html_url: string;
    url: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
    url: string;
}
