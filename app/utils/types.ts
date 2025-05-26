export type Post = {
    _id: string;
    videoUrl: string;
    imageUrl: string;
    description: string;
    location: string;
    date: Date;
    userId: string;
    loaded: boolean;
}

export type CareerStep = {
    startYear: number;
    endYear: number;
    title: string;
    description: string;
    team: string;
    footballFigure: string;
}


export type User = {
    userId: string;
    name: string;
    surname: string;
    profileImage: string;
    email: string;
    phone: string;
    description: string;
    registeredAt: Date;
    visitors: number;
    lastWeekVisitors: number;
    totalVisitors: number;
    observers: string[];
    lastWeekObservers: string[];
    totalObservers: string[];
    contact: number;
    shares: number;
    posts: Post[];
    isSearchingOpportunity: boolean;
    footballFigure: string;
    isPromisingTalent: boolean;
    numberId: number;
    presentationVideo: string;
    presentationImage: string;
    verify: boolean;
    subscriptionExpiration: Date | null;
    isPremium: boolean;
    team: string;
    region: string;
    province: string;
    birthday: Date | string;
    residence: string;
    FIGCbadge: string;
    provincesOfInterest: string;
    weight: number;
    height: number;
    rightFoot: number;
    leftFoot: number;
    category: string;
    hidden: boolean;
    lastWeekRankingPosition: number;
    lastWeekBadges: { position: number; text: string }[]
    collections: Collection[];
    condition: string;
    nationality: string;
    career: CareerStep[];
    savedProfiles: string[];
    whatsappNumber: string;
    otherEmails: string[];
    reportedBy: string[];
};

export type RegisterInfo = {
    name: string;
    surname: string;
    email: string;
    password: string;
    footballFigure: string;
    firebaseId?: string;
    verifiedCode: string;
}
export const userSkeleton: User = {
    userId: "",
    name: "",
    surname: "",
    profileImage: "",
    email: "",
    phone: "",
    description: "",
    registeredAt: new Date(),
    visitors: 0,
    lastWeekVisitors: 0,
    totalVisitors: 0,
    observers: [],
    lastWeekObservers: [],
    totalObservers: [],
    contact: 0,
    shares: 0,
    posts: [],
    isSearchingOpportunity: false,
    footballFigure: "",
    isPromisingTalent: false,
    numberId: 0,
    presentationVideo: "",
    presentationImage: "",
    verify: false,
    subscriptionExpiration: null,
    isPremium: false,
    team: "",
    region: "",
    province: "",
    birthday: new Date(),
    residence: "",
    FIGCbadge: "",
    provincesOfInterest: "",
    weight: 0,
    height: 0,
    rightFoot: 0,
    leftFoot: 0,
    category: "",
    hidden: false,
    lastWeekRankingPosition: 0,
    lastWeekBadges: [],
    collections: [],
    nationality: "",
    condition: "",
    career: [],
    savedProfiles: [],
    whatsappNumber: "",
    otherEmails: [],
    reportedBy: [],
};

export type Collection = {
    id: string;
    name: string;
    image: string;
    posts: string[];
}