import { z } from "zod";

export const ReactSelectCustomStyle = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "#1E293B",
    color: "#94A3B8",
    border: "none",
    outline: "none",
    boxShadow: "none",
    cursor: "pointer",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#1E293B",
  }),
  option: (base: any, { isFocused }: any) => ({
    ...base,
    backgroundColor: isFocused ? "#4A5568" : "#1E293B",
    color: "#fff",
    "&:active": {
      backgroundColor: "#4A5568",
    },
  }),

  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#3b4a63",
    borderRadius: 12,
    fontWeight: 500,
    padding: "0 10px",
    overflow: "hidden",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#ffffff",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#ffffff",
    cursor: "pointer",
    position: "relative",
    left: 9,
    "&:hover": {
      backgroundColor: "#607D8B",
      color: "#ffffff",
    },
  }),
};

export const interestOptions: any = [
  { value: "reading", label: "Reading" },
  { value: "traveling", label: "Traveling" },
  { value: "sports", label: "Sports" },
  { value: "cooking", label: "Cooking" },
  { value: "music", label: "Music" },
  { value: "photography", label: "Photography" },
  { value: "gaming", label: "Gaming" },
  { value: "technology", label: "Technology" },
  { value: "fitness", label: "Fitness" },
  { value: "art", label: "Art" },
  { value: "writing", label: "Writing" },
  { value: "fashion", label: "Fashion" },
  { value: "gardening", label: "Gardening" },
  { value: "history", label: "History" },
  { value: "movies", label: "Movies" },
  { value: "music_production", label: "Music Production" },
  { value: "coding", label: "Coding" },
  { value: "travel_photography", label: "Travel Photography" },
  { value: "nature", label: "Nature" },
  { value: "yoga", label: "Yoga" },
  { value: "volunteering", label: "Volunteering" },
];

export const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  nickname: z.string(),
  gender: z.string(),
  bio: z.string(),
  interest: z.array(z.string()),
  profile_photo: z.any(),
  cover_photo: z.string(),
  address: z.string(),
  birthdate: z.date({
    required_error: "A date of birth is required.",
  }),
});
