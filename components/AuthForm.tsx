"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPmodal from "./OTPmodal";



type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType : FormType) => {
  return z.object({
    email : z.string().email(),
    fullName : formType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("")

  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const user = 
        type === 'sign-up'?
      await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      }) : await signInUser({email: values.email});

      setAccountId(user.accountId)
    } catch {
      setErrorMessage("Failed to create account. please try again" )
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="chad-form-label">Full Name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your Full Name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="chad-form-label">E-mail</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your Email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            type="submit"
            className="form-submit-button "
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}{" "}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loading"
                className="ml-2 animate-spin"
                width={24}
                height={24}
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="flex body-2 justify-center">
            <p className="text-light-100" >
              {type === "sign-in"
                ? 'Don"t have an acount?'
                : "Already Have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="ml-1 font-medium text-brand">
                {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OTPmodal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
