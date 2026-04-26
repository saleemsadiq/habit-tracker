import { User, Session } from '@/types/auth'
import { getUsers, setUsers, setSession } from '@/lib/storage'

// function to generate user unique id
function generateId(): string {
    return crypto.randomUUID() //generator
}
// registers a new user and rejects if email is already takeCoverageInsideWorker, also creates a session for successful signup
export function signup(
    email: string,
    password: string
): { success: boolean; error: string | null }{
    // gets exisiting users
    const existingUsers = getUsers()

    // check if email is already registerd
    const emailAlreadyExists = existingUsers.some(
        user => user.email === email
    )

    if (emailAlreadyExists) {
        return {success: false, error: 'User already exists'}
    }

    // create new user object
    const newUser: User = {
        id: generateId(),
        email: email,
        password: password,
        createdAt: new Date().toISOString() }
    // save the updated users list
    setUsers([...existingUsers, newUser])

    // creates new session for the new user automatically
    const session: Session = {
        userId: newUser.id,
        email: newUser.email,
    }
    setSession(session)
    return {success : true , error: null,}
}

// login function for existing user, rejects email if doesnt exist or wrong password and creates session on successful login
export function login(
    email: string,
    password: string
): { success: boolean; error: string | null }{
    // get all existing users
    const existingUsers = getUsers()
    // find usr that matches email and password
    const matchedUser = existingUsers.find(
        user => user.email === email && user.password === password
    )

    // if no match, reject login
    if (!matchedUser) {
        return {success: false, error: 'Invalid email or password'}
    }
    // create session for matched user
    const session: Session = {
        userId: matchedUser.id,
        email: matchedUser.email
    }
    setSession(session)
    return {success: true , error: null}
}

// log out user by clearing current session
export function logout(): void{
    // setting session null clears it from localStorage
    setSession(null)
}

// return current logged in users session or null if nobody is signed in
export function getCurrentSession(): Session | null {
    const {getSession} = require('@/lib/storage')
    return getSession()
}
