import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Trash2 } from 'lucide-react';

const رموز_المعلمين = {
  "1234": { name: 'المعلم أحمد' },
  "5678": { name: 'المعلمة سعاد' },
  "9012": { name: 'المعلم يوسف' },
  "3456": { name: 'المعلمة فاطمة' },
};

export default function واجباتي() {
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [teacherStudents, setTeacherStudents] = useState<{ [code: string]: { name: string; points: number } }>({});

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <h1 className="text-3xl font-bold text-center text-yellow-800 mb-6">موقع واجباتي للأطفال</h1>

      {!userType && (
        <تسجيلالدخول
          onLogin={(type, name, code) => {
            setUserType(type);
            setUserName(name);
            setTeacherCode(code || '');
            setLoggedIn(true);
          }}
          teacherStudents={teacherStudents}
        />
      )}

      {loggedIn && userType === 'student' && <طالب name={userName} />}
      {loggedIn && userType === 'teacher' && (
        <لوحةالمعلم
          name={userName}
          onChangeName={(newName) => setUserName(newName)}
          students={teacherStudents}
          onAddStudent={(code, name) => {
            setTeacherStudents(prev => ({ ...prev, [code]: { name, points: 0 } }));
          }}
          onDeleteStudent={(code) => {
            const updated = { ...teacherStudents };
            delete updated[code];
            setTeacherStudents(updated);
          }}
          onUpdatePoints={(code, points) => {
            setTeacherStudents(prev => ({
              ...prev,
              [code]: { ...prev[code], points }
            }));
          }}
        />
      )}
    </div>
  );
}

function تسجيلالدخول({
  onLogin,
  teacherStudents,
}: {
  onLogin: (type: 'student' | 'teacher', name: string, code?: string) => void;
  teacherStudents: { [code: string]: { name: string } };
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (رموز_المعلمين[code]) {
      onLogin('teacher', رموز_المعلمين[code].name, code);
    } else if (teacherStudents[code]) {
      onLogin('student', teacherStudents[code].name);
    } else {
      setError('رمز غير صحيح. حاول مرة أخرى.');
    }
  };

  return (
    <Card className="max-w-sm mx-auto bg-white">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-center mb-4">أدخل الرمز للدخول</h2>
        <Input value={code} onChange={e => setCode(e.target.value)} placeholder="أدخل الرمز..." className="mb-3" />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button className="w-full" onClick={handleLogin}>دخول</Button>
      </CardContent>
    </Card>
  );
}

function طالب({ name }: { name: string }) {
  const [textHomework, setTextHomework] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log('نص الواجب:', textHomework);
    console.log('الملف:', file);
    setSubmitted(true);
  };

  return (
    <Card className="max-w-md mx-auto mt-6 bg-white">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-center mb-4">مرحباً {name}!</h2>
        <h3 className="font-semibold mb-2">ارفع واجبك:</h3>
        <Textarea placeholder="اكتب الواجب هنا..." className="mb-3" value={textHomework} onChange={e => setTextHomework(e.target.value)} />
        <Input type="file" className="mb-3" onChange={e => setFile(e.target.files?.[0] || null)} />
        <Button className="w-full" onClick={handleSubmit}>إرسال الواجب</Button>
        {submitted && <p className="text-green-600 text-center mt-2">تم إرسال الواجب بنجاح!</p>}
      </CardContent>
    </Card>
  );
}

function لوحةالمعلم({ name, onChangeName, students, onAddStudent, onDeleteStudent, onUpdatePoints }: {
  name: string;
  onChangeName: (name: string) => void;
  students: { [code: string]: { name: string; points: number } };
  onAddStudent: (code: string, name: string) => void;
  onDeleteStudent: (code: string) => void;
  onUpdatePoints: (code: string, points: number) => void;
}) {
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState(name);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-center mb-4">مرحباً {name}!</h2>

          <h3 className="font-semibold mb-2">تعديل اسم المعلم</h3>
          <div className="flex gap-2 mb-4">
            <Input value={editName} onChange={e => setEditName(e.target.value)} />
            <Button onClick={() => onChangeName(editName)}>حفظ</Button>
          </div>

          <h3 className="font-semibold mb-2">إضافة طالب جديد</h3>
          <Input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="رمز الطالب" className="mb-2" />
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسم الطالب" className="mb-2" />
          <Button className="w-full mb-4" onClick={() => {
            if (newCode && newName) {
              onAddStudent(newCode, newName);
              setNewCode('');
              setNewName('');
            }
          }}>إضافة الطالب</Button>

          <h3 className="font-semibold mb-2">إدارة الطلاب</h3>
          <div className="space-y-3">
            {Object.entries(students).map(([code, info]) => (
              <div key={code} className="border p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p><strong>{info.name}</strong> (رمز: {code})</p>
                  <p>النقاط: {info.points}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    className="w-20"
                    value={info.points}
                    onChange={e => onUpdatePoints(code, Number(e.target.value))}
                  />
                  <Button variant="destructive" size="sm" onClick={() => onDeleteStudent(code)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-2 mt-6">إضافة واجب جديد</h3>
          <Input placeholder="عنوان الواجب" className="mb-2" />
          <Textarea placeholder="تفاصيل الواجب..." className="mb-2" />
          <Button variant="outline" className="w-full"><UploadCloud className="ml-2" />إرفاق ملف</Button>
          <Button className="w-full mt-3">نشر الواجب</Button>
        </CardContent>
      </Card>
    </div>
  );
}