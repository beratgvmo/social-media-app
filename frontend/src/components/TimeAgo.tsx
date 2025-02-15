const TimeAgo = ({ createdAt }: { createdAt: Date }) => {
    const timeDifference = (createdAt: Date) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInMs = now.getTime() - createdDate.getTime();

        const minutes = Math.floor(diffInMs / (1000 * 60));
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

        if (minutes < 3) {
            return `yeni`;
        } else if (minutes < 60) {
            return `${minutes} dakika`;
        } else if (hours < 24) {
            return `${hours} saat`;
        } else if (days < 30) {
            return `${days} gün`;
        } else if (months < 12) {
            return `${months} ay`;
        } else {
            return `${years} yıl`;
        }
    };

    return <span>{timeDifference(createdAt)}</span>;
};

export default TimeAgo;
