"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import Image from "next/image";
import moment from "moment";
import ReactSelect from "react-select";
import { USER_PROFILE_UPDATE, USER_SESSION, USER_UPLOAD_PROFILE_PHOTO } from "@/services/user";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormSchema, interestOptions, ReactSelectCustomStyle } from "./custom";

import PuffLoader from "react-spinners/PuffLoader";
const override: any = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

import "moment/locale/id";
moment.locale("id");

export function ProfileForm() {
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      nickname: "",
      gender: "",
      bio: "",
      interest: [],
      profile_photo: null,
      cover_photo: "",
      address: "",
      birthdate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const session = await USER_SESSION();
    const userID: any = session?.user.id;

    setLoading(true);

    let profilePhotoUrl = "";
    if (data.profile_photo instanceof File) {
      const fileUrl = await USER_UPLOAD_PROFILE_PHOTO(data.profile_photo);
      if (fileUrl) profilePhotoUrl = fileUrl;
    }

    const updatedData = {
      ...data,
      profile_photo: profilePhotoUrl,
      birthdate: moment(data.birthdate).format("D MMMM YYYY"),
      interest: data.interest.join(", "),
    };

    const result = await USER_PROFILE_UPDATE(userID, updatedData);
    if (result.error) {
      console.error(result.error);
      setLoading(false);
    } else {
      console.log(result);
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {previewImage && (
          <div className="mt-4">
            <Image
              src={previewImage}
              alt="Image Preview"
              width={300}
              height={300}
              className="rounded-lg shadow-[0_0_16px_-4px_#fff]"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="!mt-4">
              <FormLabel className={form.formState.errors.profile_photo ? "text-inherit" : ""}>Profile Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className={`${form.formState.errors.profile_photo ? "border-orange-400" : ""} bg-[#1E2840] !mt-0`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);

                    // Generate a preview URL
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setPreviewImage(imageUrl);
                    } else {
                      setPreviewImage(null);
                    }
                  }} // Update the field value to the selected file
                />
              </FormControl>
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="!mt-4">
              <FormLabel className={form.formState.errors.username ? "text-inherit" : ""}>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  className={`${form.formState.errors.username ? "border-orange-400" : ""} bg-[#1E2840] !mt-0`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem className="!mt-4">
              <FormLabel className={form.formState.errors.nickname ? "text-inherit" : ""}>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="nickname" className={` bg-[#1E2840] !mt-0`} {...field} />
              </FormControl>
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="!mt-4">
              <FormLabel className={form.formState.errors.gender ? "text-inherit" : ""}>Gender</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className={` bg-[#1E2840] !mt-0`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col !mt-6">
              <FormLabel className={form.formState.errors.birthdate ? "text-inherit" : ""}>Birthdate</FormLabel>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        `pl-3 text-left font-normal ${
                          form.formState.errors.birthdate ? "border-orange-400" : ""
                        } bg-[#1E2840] !mt-1`,
                        !field.value && "text-muted-foreground"
                      )}
                      onClick={() => setIsPopoverOpen(true)}
                    >
                      {field.value ? moment(field.value).format("D MMMM YYYY") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    defaultMonth={tenYearsAgo}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsPopoverOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01") ||
                      date > new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interest"
          render={({ field }) => (
            <FormItem className="!mt-4">
              <FormLabel className={form.formState.errors.interest ? "text-inherit" : ""}>Interest</FormLabel>
              <ReactSelect
                {...field}
                isMulti
                options={interestOptions}
                className={`basic-multi-select bg-[#1E293B] !mt-0`}
                classNamePrefix="select"
                styles={ReactSelectCustomStyle}
                value={interestOptions.filter((option: any) => field.value.includes(option.value))}
                onChange={(e: any) => {
                  const msv = e.map((u: any) => u.value);
                  field.onChange(msv);
                }}
              />
              <FormMessage className="font-normal text-orange-400 !mt-0" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-full ">
          {loading ? <PuffLoader size={32} color="#020917" cssOverride={override} /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
