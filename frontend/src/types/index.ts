//github
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

//post
export interface Post {
    id: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    user: User;
    border?: boolean;
    content: string;
    postImages: PostImage[];
    githubApiUrl?: string;
    githubType?: "user" | "repo";
    codeContent?: string;
    codeLanguage?: string;
    codeTheme?: "light" | "dark";
}

export interface PostImage {
    id: number;
    url: string;
}

//user
export interface User {
    id: number;
    name: string;
    email: string;
    slug: string;
    bio: string;
    isPrivate: boolean;
    profileImage: string | null;
    bannerImage: string | null;
    followerCount: number;
    followingCount: number;
}
