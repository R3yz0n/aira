import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

const categories = [
  { name: "Wedding", totalEvents: 42, description: "Weddings and receptions" },
  { name: "Corporate", totalEvents: 28, description: "Corporate summits and meetups" },
  { name: "Birthday", totalEvents: 18, description: "Birthday parties and celebrations" },
  { name: "Concert", totalEvents: 9, description: "Concerts and live shows" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage and track your event categories</p>
        </div>
        <Button className="flex items-center gap-2 bg-aira-blue text-white hover:bg-aira-blue/90">
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      <Card className="p-6 bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Category Name</TableHead>
              <TableHead className="text-foreground">Items</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-lg text-center text-muted-foreground">
                  No categories available
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium text-foreground">{category.name}</TableCell>

                  <TableCell className="text-muted-foreground">{category.totalEvents}</TableCell>
                  <TableCell className="text-muted-foreground">{category.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
