// components/admin/StudentList.js
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function StudentList({ students, onDeleteStudent }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Student List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Major</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.ID}>
              <TableCell>{student.Name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.Age}</TableCell>
              <TableCell>{student.major}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteStudent(student.ID)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
