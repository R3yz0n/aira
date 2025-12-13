export const config = {
  companyDetails: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "",
    tagline: process.env.NEXT_PUBLIC_COMPANY_TAGLINE || "",
    office: {
      address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "",
      city: process.env.NEXT_PUBLIC_OFFICE_CITY || "",
      mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
    },
    contact: {
      phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY || "",
      phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY || "",
      email: process.env.NEXT_PUBLIC_EMAIL || "",
    },
    workingHours: {
      weekdays: process.env.NEXT_PUBLIC_WORKING_HOURS || "",
      sunday: process.env.NEXT_PUBLIC_WORKING_HOURS_SUNDAY || "",
    },
    social: {
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
      twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
      youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    },
  },
};
