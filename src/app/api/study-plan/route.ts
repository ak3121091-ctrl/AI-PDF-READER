import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { StudyPlan, StudyTask } from '@/lib/database/schema';

export async function GET(req: NextRequest) {
  try {
    const { plan, tasks } = db.getStudyPlan('user-ashutosh');
    return NextResponse.json({ plan, tasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examDate, dailyHours = 3, currentLevel = 'intermediate' } = body;

    const planId = 'plan-' + Date.now();
    const newPlan: StudyPlan = {
      id: planId,
      userId: 'user-ashutosh',
      title: 'Targeted Exam Master Plan',
      examDate: examDate || '2026-12-15',
      dailyHours: Number(dailyHours),
      currentLevel: currentLevel as any,
      createdAt: new Date().toISOString(),
    };

    // Generate intelligent day-by-day tasks based on available documents
    const documents = db.getDocuments('user-ashutosh');
    const tasks: StudyTask[] = [];

    let day = 1;
    for (const doc of documents) {
      const docTopics = db.getTopics(doc.id);
      for (const t of docTopics.slice(0, 2)) {
        tasks.push({
          id: `task-${planId}-d${day}-1`,
          studyPlanId: planId,
          dayNumber: day,
          title: `Master ${t.name}`,
          description: `Read core derivations, verify key definitions, and review exam weightage (${t.weightagePercentage}%).`,
          durationMinutes: 45,
          type: 'reading',
          completed: false,
          documentId: doc.id,
          topicName: t.name,
        });

        tasks.push({
          id: `task-${planId}-d${day}-2`,
          studyPlanId: planId,
          dayNumber: day,
          title: `Practice Questions & Derivations`,
          description: `Solve 10 practice problems and check formulas for ${t.name}.`,
          durationMinutes: 30,
          type: 'practice',
          completed: false,
          documentId: doc.id,
          topicName: t.name,
        });

        tasks.push({
          id: `task-${planId}-d${day}-3`,
          studyPlanId: planId,
          dayNumber: day,
          title: `Active Recall Flashcards`,
          description: `Review 10 flashcards for ${doc.title.split('—')[0].trim()}.`,
          durationMinutes: 15,
          type: 'flashcards',
          completed: false,
          documentId: doc.id,
        });

        day++;
      }
    }

    db.createStudyPlan(newPlan, tasks);

    return NextResponse.json({
      success: true,
      plan: newPlan,
      tasks,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId } = body;
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }
    const completed = db.toggleTask(taskId);
    return NextResponse.json({ success: true, completed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
