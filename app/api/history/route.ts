import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

async function verifyToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.split('Bearer ')[1]
    const decoded = await adminAuth.verifyIdToken(token)
    return decoded.uid
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const snapshot = await adminDb
      .collection('history')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const entries = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString(),
      }
    })

    return NextResponse.json({ entries })
  } catch (err) {
    console.error('[history GET]', err)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { inputText, platform, tone, generated } = await req.json()
    const docRef = await adminDb.collection('history').add({
      userId: uid,
      inputText,
      platform,
      tone,
      generated,
      createdAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ id: docRef.id })
  } catch (err) {
    console.error('[history POST]', err)
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing entry id' }, { status: 400 })

  try {
    const docRef = adminDb.collection('history').doc(id)
    const snap = await docRef.get()
    if (!snap.exists || snap.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    await docRef.delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[history DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}