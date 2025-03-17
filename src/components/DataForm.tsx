"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";


function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}


const numberField = (opts: {
  requiredMessage?: string;
  invalidMessage?: string;
  min?: number;
  max?: number;
  integer?: boolean;
  minMessage?: string;
  maxMessage?: string;
}) => {
  return z
    .string()
    .nonempty({ message: opts.requiredMessage || "Required" })
    .refine((val) => !isNaN(Number(val)), {
      message: opts.invalidMessage || "Must be a number",
    })
    .transform((val) => Number(val))
    .refine((val) => (opts.integer ? Number.isInteger(val) : true), {
      message: "Must be an integer",
    })
    .refine(
      (val) => opts.min === undefined || val >= opts.min!,
      { message: opts.minMessage || `Must be at least ${opts.min}` }
    )
    .refine(
      (val) => opts.max === undefined || val <= opts.max!,
      { message: opts.maxMessage || `Must be at most ${opts.max}` }
    );
};


const formSchema = z.object({
  
  gpa: numberField({
    min: 0,
    max: 10,
    requiredMessage: "GPA is required",
    minMessage: "GPA must be at least 0",
    maxMessage: "GPA must be less than or equal to 10",
  }),
  attendance: numberField({
    min: 0,
    max: 100,
    requiredMessage: "Attendance is required",
    minMessage: "Attendance must be at least 0",
    maxMessage: "Attendance must be at most 100",
  }),
  
  backlogs: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Backlogs is required",
    minMessage: "Backlogs must be at least 0",
    max: 10,
    maxMessage: "Backlogs must be at most 10",
  }),
  internships: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Internships is required",
    minMessage: "Internships must be at least 0",
    max: 10,
    maxMessage: "Internships must be at most 10",
  }),
  internship_duration: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Internship duration is required",
    minMessage: "Internship duration must be at least 0",
    max: 12,
    maxMessage: "Internship duration must be at most 12 months",
  }),
  leadership_skill: numberField({
    min: 1,
    max: 10,
    integer: true,
    requiredMessage: "Leadership skill is required",
    minMessage: "Leadership skill must be at least 1",
    maxMessage: "Leadership skill must be at most 10",
  }),
  communication_skill: numberField({
    min: 1,
    max: 10,
    integer: true,
    requiredMessage: "Communication skill is required",
    minMessage: "Communication skill must be at least 1",
    maxMessage: "Communication skill must be at most 10",
  }),
  teamwork_ability: numberField({
    min: 1,
    max: 10,
    integer: true,
    requiredMessage: "Teamwork ability is required",
    minMessage: "Teamwork ability must be at least 1",
    maxMessage: "Teamwork ability must be at most 10",
  }),
  problem_solving_ability: numberField({
    min: 1,
    max: 10,
    integer: true,
    requiredMessage: "Problem solving ability is required",
    minMessage: "Problem solving ability must be at least 1",
    maxMessage: "Problem solving ability must be at most 10",
  }),
  job_applications_sent: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Job applications sent is required",
    minMessage: "Job applications sent must be at least 0",
    max: 50,
    maxMessage: "Job applications sent must be at most 50",
  }),
  interviews_attended: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Interviews attended is required",
    minMessage: "Interviews attended must be at least 0",
    max: 20,
    maxMessage: "Interviews attended must be at most 20",
  }),
  major_projects_completed: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Major projects completed is required",
    minMessage: "Major projects completed must be at least 0",
    max: 10,
    maxMessage: "Major projects completed must be at most 10",
  }),
  mock_interviews: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Mock interviews is required",
    minMessage: "Mock interviews must be at least 0",
    max: 20,
    maxMessage: "Mock interviews must be at most 20",
  }),
  competitions: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Competitions is required",
    minMessage: "Competitions must be at least 0",
    max: 20,
    maxMessage: "Competitions must be at most 20",
  }),
  volunteer_experience: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Volunteer experience is required",
    minMessage: "Volunteer experience must be at least 0",
    max: 36,
    maxMessage: "Volunteer experience must be at most 36 months",
  }),
  career_counseling: numberField({
    min: 0,
    integer: true,
    requiredMessage: "Career counseling is required",
    minMessage: "Career counseling must be at least 0",
    max: 10,
    maxMessage: "Career counseling must be at most 10",
  }),
  gender: z.enum(["Male", "Female"]),
  stream_type: z.enum(["Technical", "Non-Technical"]),
});



export default function DataForm() {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gpa: "",
      attendance: "",
      backlogs: "0",
      internships: "0",
      internship_duration: "0",
      leadership_skill: "1",
      communication_skill: "1",
      teamwork_ability: "1",
      problem_solving_ability: "1",
      job_applications_sent: "0",
      interviews_attended: "0",
      major_projects_completed: "0",
      mock_interviews: "0",
      competitions: "0",
      volunteer_experience: "0",
      career_counseling: "0",
      gender: "Male",
      stream_type: "Technical",
    },
  });

  const router = useRouter()

  async function onSubmit(values: z.input<typeof formSchema>) {
    try {
      console.log("Transformed form values:", values);
      const { data } = await axios.post("/api/predict", values, {
        headers: { "Content-Type": "application/json" },
      });
      sessionStorage.setItem("formData", JSON.stringify(data));
      router.push(`results`)
      console.log("Response:", data);
      alert(`Redirecting to Results Page`);
    } catch (error) {
      console.error("Error making prediction", error);
      alert("Error making prediction");
    }
  }

  return (
    <div className="my-10 mx-auto w-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="stream_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream Type</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    <option value="Technical">Technical</option>
                    <option value="Non-Technical">Non-Technical</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall GPA/CGPA</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Enter your Overall GPA/CGPA"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="attendance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attendance Percentage</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter attendance percentage"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="backlogs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Backlogs</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="internships"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Internships Completed</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="internship_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internship Duration (months)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 12).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="leadership_skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leadership Skill (1-10)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(1, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="communication_skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Communication Skill (1-10)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(1, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="teamwork_ability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teamwork Ability (1-10)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(1, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="problem_solving_ability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Solving Ability (1-10)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(1, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="job_applications_sent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Applications Sent</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 250).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="interviews_attended"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interviews Attended</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 50).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="major_projects_completed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major Projects Completed</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="mock_interviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mock Interviews Attended</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 20).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="competitions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competitions Participated In</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 20).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

     
          <FormField
            control={form.control}
            name="volunteer_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volunteer Experience (months)</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 36).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <FormField
            control={form.control}
            name="career_counseling"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Counseling Sessions Attended</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-black dark:text-white">
                    {range(0, 10).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}




// "use client"

// import React from "react"
// import axios from "axios"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"

// export default function DataForm() {
//   // Submit handler
//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const formObject: Record<string, any> = {};

//     formData.forEach((value, key) => {
//       formObject[key] = value;
//     });

//     try {
//       const { data } = await axios.post("/api/predict", formObject, {
//         headers: { "Content-Type": "application/json" },
//       })
//       alert(`Employability Prediction: ${data.prediction}`);
//     } catch (error) {
//       console.error("Error making prediction", error);
//       alert("Error making prediction");
//     }
//   };

//   return (
//     <div className="my-10 mx-auto w-96">
//       <form onSubmit={onSubmit} className="space-y-8">
//         <div className="form-item">
//           <Label htmlFor="gender">Gender</Label>
//           <select id="gender" name="gender" required>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//         </div>

//         <div className="form-item">
//           <Label htmlFor="stream_type">Stream Type</Label>
//           <select id="stream_type" name="stream_type" required>
//             <option value="Technical">Technical</option>
//             <option value="Non-Technical">Non-Technical</option>
//           </select>
//         </div>

//         <div className="form-item">
//           <Label htmlFor="gpa">Overall GPA/CGPA</Label>
//           <input
//             id="gpa"
//             name="gpa"
//             type="number"
//             step="0.01"
//             placeholder="Enter your Overall GPA/CGPA"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="backlogs">Number of Backlogs</Label>
//           <input
//             id="backlogs"
//             name="backlogs"
//             type="number"
//             placeholder="Enter number of backlogs"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="attendance">Attendance Percentage</Label>
//           <input
//             id="attendance"
//             name="attendance"
//             type="number"
//             placeholder="Enter attendance percentage"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="internships">Number of Internships Completed</Label>
//           <input
//             id="internships"
//             name="internships"
//             type="number"
//             placeholder="Enter number of internships"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="internship_duration">Internship Duration (months)</Label>
//           <input
//             id="internship_duration"
//             name="internship_duration"
//             type="number"
//             placeholder="Enter internship duration"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="leadership_skill">Leadership Skill (1-10)</Label>
//           <input
//             id="leadership_skill"
//             name="leadership_skill"
//             type="number"
//             placeholder="Rate leadership skill"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="communication_skill">Self-Rated Communication Skill (1-10)</Label>
//           <input
//             id="communication_skill"
//             name="communication_skill"
//             type="number"
//             placeholder="Rate communication skill"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="teamwork_ability">Teamwork Ability (1-10)</Label>
//           <input
//             id="teamwork_ability"
//             name="teamwork_ability"
//             type="number"
//             placeholder="Rate teamwork ability"
//             required
//           />
//         </div>

//         <div className="form-item">
//           <Label htmlFor="problem_solving_ability">Problem Solving Ability (1-10)</Label>
//           <input
//             id="problem_solving_ability"
//             name="problem_solving_ability"
//             type="number"
//             placeholder="Rate problem solving ability"
//             required
//           />
//         </div>

//         {/* More fields can be added in similar fashion */}

//         <Button type="submit" className="w-full">Submit</Button>
//       </form>
//     </div>
//   )
// }
