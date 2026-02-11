const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create User: Ajmal KSA
    const user = await prisma.user.upsert({
        where: { username: 'ajmalksa' },
        update: {},
        create: {
            username: 'ajmalksa',
            password: 'password123', // In a real app, hash this!
            email: 'ajmalksa@gmail.com',
            fullname: 'Ajmal KSA',
            balance: 0.0,
            role: 'reseller',
            notifications: {
                create: [
                    { text: 'Welcome to the New HD Beinsport panel.' },
                    { text: 'تم اضافة كل العروض على سيستم AFRICA Cup of Nations Morocco 2025' },
                ],
            },
            operations: {
                create: [
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                    { type: 'CHECK', details: 'Check user status', status: 'SUCCESS', cost: 0 },
                ],
            },
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
