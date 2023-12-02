/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import React from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import userData from "../Services/MyData";
import Loader from "./Loader";

interface setShowModalFunc {
  setShowModal: Function;
  id?: any;
  update?: boolean;
  setUpdate?: any;
}

const EditUser: React.FC<setShowModalFunc> = ({
  setShowModal,
  id
}): any => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [selectGender, setGender] = useState();
  const form = useForm();
  const {
    register,
    getValues,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    userData
      .updateUser(id, data)
      .then((res) => {
        toast.success("User Updated Successfully");
        setShowModal(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getData = async () => {
    setLoading(true);
    userData
      .getUserById(id)
      .then((res) => {
        setData(res);
        setGender(res?.gender)
        setValue("firstName", res?.firstName);
        setValue("lastName", res?.lastName);
        setValue("email", res?.email);
        setValue("age", res?.age);
        setValue("gender", res?.gender);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
      
  };

  const handleDropdownChange = (name: string, value: any) => {
    if (name === "gender") {
      setGender(value);
    }
  };
  const gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <ToastContainer/>
    
      <div className="z-[100] justify-center mb-10 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none mx-5 mt-20">
        <div className="w-full my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg flex flex-col w-full px-5 bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between pt-3 px-2 md:p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h6 className="text-sm md:text-3xl font-semibold">
               Edit User
              </h6>
              <button
                className="p-1 ml-auto border-0 text-black opacity-60 float-right text-3xl leading-none font-semibold"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="black"
                    d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"
                  />
                </svg>
              </button>
            </div>
            {loading ? <Loader/> : 
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:grid md:grid-cols-2 gap-4 my-4"
            >
              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  defaultValue={data?.firstName}
                  {...register("firstName")}
                  className="border p-2 rounded-md border-[#ccc] outline-[#2684ff] w-full"
                  placeholder="Enter First Name"
                />
                {errors?.firstName && (
                  <p className="text-danger text-xs left-0 w-full">
                    Please Enter First Name
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  defaultValue={data?.lastName}
                  {...register("lastName", {
                    onChange: (e) => {
                      setValue("lastName", e.target.value);
                    },
                    required: "Last Name is required",
                  })}
                  className="border outline-[#2684ff] p-2 rounded-md border-[#ccc] w-full"
                  placeholder="Enter Last Name"
                />
                {errors?.lastName && (
                  <p className="text-danger text-xs left-0 w-full">
                    Please Enter Last Name
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col lg:max-w-sm gap-1">
                <label className="font-medium" htmlFor="gender">
                  Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      key={field.name}
                      options={gender}
                      className="flex-1 w-full"
                      defaultValue={selectGender}
                      value={gender?.find((opt) => opt.value === selectGender)}
                      onChange={(option) => {
                        handleDropdownChange("gender", option?.value);
                        field.onChange(option?.value);
                      }}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "40px", // Adjust the height of the control
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Set a high zIndex value to ensure dropdown is on top of other elements
                        }),
                      }}
                      placeholder="Select Gender"
                      required
                    />
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="phone">
                  Enter Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={data?.email}
                  className="border outline-[#2684ff] p-2 rounded-md border-[#ccc] w-full [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter Email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors?.phone && (
                  <p className="text-danger text-xs left-0 w-full">
                    Please Enter Email
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="age">
                 Enter Age
                </label>
                <input
                  id="age"
                  type="number"
                  defaultValue={data?.age}
                  className="border outline-[#2684ff] p-2 rounded-md border-[#ccc] w-full [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter Age Number"
                  {...register("age", {
                    required: "Age Number is required",
                  })}
                />
                {errors?.age && (
                  <p className="text-danger text-xs left-0 w-full">
                    Please Enter Age
                  </p>
                )}
              </div>
              <button
                className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 col-span-2 ml-auto"
                type="submit"
              >
               Update User
              </button>
            </form>
        }
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-10 bg-black"></div>
    </>
  );
};

export default EditUser;
