import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { addNewUser, getRoles } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddNewUser: React.FC<{ className?: string }> = ({ className }) => {
  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useQuery<Roles[]>({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: getRoles,
  });

  rolesLoading && <div>Loading...</div>;
  rolesError && <div>Error fetching roles</div>;

  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [role, setRole] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAddNewUser = async () => {
    console.log(firstName, lastName, email, role, password);

    if (firstName === "" || lastName === "" || email === "" || role === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      const result = await addNewUser(
        email,
        password,
        firstName,
        lastName,
        Number(role)
      );

      if (result.status === 500) {
        toast.error("User with that email already exists");
      } else if (result.status === 204) {
        console.log("User added successfully");
        toast.success("User added successfully");
        setFirstName("");
        setLastName("");
        setEmail("");
        setRole("");
        setPassword("");
      } else {
        toast.error("Error adding user");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-md", className)}>
      <h1 className="text-2xl font-semibold mb-6">Add New User</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Izaberite role za korisnika" />
            </SelectTrigger>
            <SelectContent>
              {roles &&
                roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1"
          />
        </div>
        <Button onClick={handleAddNewUser}>Add User</Button>
      </div>
    </div>
  );
};

export { AddNewUser };
