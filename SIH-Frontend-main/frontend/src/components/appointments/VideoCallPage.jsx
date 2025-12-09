import React, { useMemo, useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';

const InfoLine = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold break-all">{value}</span>
  </div>
);

const buildFallbackMeeting = (topic) => {
  const slug = `sih-room-${Date.now()}`;
  const url = `https://meet.jit.si/${slug}`;
  return {
    id: slug,
    topic: topic || 'Counselling Session',
    password: null,
    start_url: url,
    join_url: url,
  };
};

const VideoCallPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [topic, setTopic] = useState('Counselling Session');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(45);
  const [timezone, setTimezone] = useState('UTC');
  const [agenda, setAgenda] = useState('Student–Counsellor session');
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  const isHost = useMemo(() => (user?.role || '').toLowerCase() === 'counsellor', [user?.role]);

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
    const fallback = buildFallbackMeeting(topic);
    setMeeting(fallback);
    setLoading(false);
  };

  const handleJoin = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className={`text-3xl font-bold ${theme.colors.text}`}>Video Call (Jitsi)</h1>
            <p className={`${theme.colors.muted} max-w-2xl`}>Create a Jitsi room and share the links so you and the other person can join together. No Zoom needed.</p>
          </div>
          <Badge className="bg-cyan-100 text-cyan-700">{user?.role || 'user'}</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`${theme.colors.card} border-0 shadow-2xl`}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text}`}>Set up a meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleCreate}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Topic</label>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Session topic" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Start time (optional)</label>
                  <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Duration (minutes)</label>
                    <Input type="number" min={15} max={240} value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Timezone</label>
                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Agenda / notes</label>
                  <Textarea rows={3} value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="What this session will cover" />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
                  {loading ? 'Preparing room...' : 'Create video room'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className={`${theme.colors.card} border-0 shadow-2xl`}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text}`}>How joining works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className={`${theme.colors.text}`}>1) Create the meeting. 2) Share the student link. 3) Both open links to join.</p>
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
                  <p className="font-semibold text-cyan-700 mb-1">Counsellor</p>
                  <p className="text-sm text-cyan-800">Use the Host link to start the meeting.</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <p className="font-semibold text-emerald-700 mb-1">Student</p>
                  <p className="text-sm text-emerald-800">Use the Participant link to join the room.</p>
                </div>
              </div>

              {meeting ? (
                <div className="space-y-3 p-4 rounded-xl border bg-gray-50">
                  <h4 className="font-semibold text-gray-800">Meeting ready</h4>
                  <InfoLine label="Topic" value={meeting.topic} />
                  {meeting.password && <InfoLine label="Passcode" value={meeting.password} />}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Links</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={() => handleJoin(meeting.start_url)}>
                        Host link (counsellor)
                      </Button>
                      <Button variant="outline" onClick={() => handleJoin(meeting.join_url)}>
                        Participant link (student)
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${theme.colors.muted} text-sm`}>No meeting yet. Create one to get host and participant links.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
