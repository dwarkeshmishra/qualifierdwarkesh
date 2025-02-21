import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { jsonInputSchema, type JsonFormData } from "@/lib/validators";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const form = useForm<JsonFormData>({
    resolver: zodResolver(jsonInputSchema),
    defaultValues: {
      jsonInput: '{ "data": ["M","1","334","4","B"] }'
    }
  });

  useEffect(() => {
    document.title = "ABCD123"; // Set roll number as title
  }, []);

  const processMutation = useMutation({
    mutationFn: async (data: string) => {
      const res = await apiRequest("POST", "/api/bfhl", JSON.parse(data));
      return res.json();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process array"
      });
    }
  });

  const { data: processedData } = useQuery({
    queryKey: ["processedData"],
    queryFn: () => processMutation.data,
    enabled: !!processMutation.data
  });

  function onSubmit(data: JsonFormData) {
    processMutation.mutate(data.jsonInput);
  }

  function getFilteredResponse() {
    if (!processedData) return null;

    const result: Record<string, any> = {
      is_success: processedData.is_success,
      user_id: processedData.user_id,
      email: processedData.email,
      roll_number: processedData.roll_number
    };

    if (selectedFilters.includes("numbers")) {
      result.numbers = processedData.numbers;
    }
    if (selectedFilters.includes("alphabets")) {
      result.alphabets = processedData.alphabets;
    }
    if (selectedFilters.includes("highest_alphabet")) {
      result.highest_alphabet = processedData.highest_alphabet;
    }

    return result;
  }

  const filterOptions = [
    { label: "Numbers", value: "numbers" },
    { label: "Alphabets", value: "alphabets" },
    { label: "Highest Alphabet", value: "highest_alphabet" }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jsonInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JSON Input</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={processMutation.isPending}>
                Process Array
              </Button>
            </form>
          </Form>

          {processedData && (
            <div className="mt-8 space-y-4">
              <MultiSelect
                value={selectedFilters}
                onValueChange={setSelectedFilters}
                options={filterOptions}
                placeholder="Select filters..."
              />

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(getFilteredResponse(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}