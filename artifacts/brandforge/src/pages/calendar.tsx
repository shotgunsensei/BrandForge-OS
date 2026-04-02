import { useState, useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useListCalendarItems, useCreateCalendarItem, useUpdateCalendarItem, useDeleteCalendarItem, getListCalendarItemsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalIcon, Trash2 } from "lucide-react";

const itemTypes = ["post", "email", "ad", "blog", "video", "event", "launch", "other"];
const statuses = ["idea", "planned", "in_progress", "scheduled", "published"];

export default function CalendarPage() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useListCalendarItems(tenantId!, {}, { query: { enabled: !!tenantId } });
  const createItem = useCreateCalendarItem();
  const deleteItem = useDeleteCalendarItem();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", itemType: "post", channel: "social", scheduledDate: "", description: "" });
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const itemsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    items?.forEach(item => {
      const dateStr = item.scheduledDate;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(item);
    });
    return map;
  }, [items]);

  const handleCreate = () => {
    if (!tenantId || !form.title || !form.scheduledDate) return;
    createItem.mutate(
      { tenantId, data: form },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCalendarItemsQueryKey(tenantId) }); setOpen(false); setForm({ title: "", itemType: "post", channel: "social", scheduledDate: "", description: "" }); } }
    );
  };

  const prev = () => setCurrentDate(new Date(year, month - 1));
  const next = () => setCurrentDate(new Date(year, month + 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <p className="text-muted-foreground">Plan and schedule your content</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Calendar Item</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Blog post: How to..." /></div>
                <div><Label>Scheduled Date</Label><Input type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Type</Label>
                    <Select value={form.itemType} onValueChange={v => setForm({...form, itemType: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{itemTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Channel</Label><Input value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} placeholder="social, email..." /></div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <Button onClick={handleCreate} disabled={!form.title || !form.scheduledDate} className="w-full">Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
              <CardTitle className="text-lg">{monthName}</CardTitle>
              <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {days.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="min-h-[80px]" />;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayItems = itemsByDate[dateStr] || [];
                const isToday = new Date().toISOString().split("T")[0] === dateStr;
                return (
                  <div key={day} className={`min-h-[80px] border rounded-md p-1 ${isToday ? "bg-primary/5 border-primary/20" : "border-border/50"}`}>
                    <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</div>
                    <div className="space-y-0.5">
                      {dayItems.slice(0, 3).map(item => (
                        <div key={item.id} className="text-[10px] px-1 py-0.5 rounded bg-primary/10 text-primary truncate cursor-default" title={item.title}>
                          {item.title}
                        </div>
                      ))}
                      {dayItems.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayItems.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">All Items</CardTitle></CardHeader>
          <CardContent>
            {!items || items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No calendar items yet. Add your first piece of content to the calendar.</p>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{item.scheduledDate}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{item.itemType}</Badge>
                        <Badge variant="outline" className="text-xs capitalize">{item.status}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => tenantId && deleteItem.mutate({ tenantId, itemId: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCalendarItemsQueryKey(tenantId) }) })}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
