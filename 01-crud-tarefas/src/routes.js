import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { compileFunction } from "node:vm"

const database = new Database()
export const routes = [
    {
        // { title: 'Teste', description: 'Teste' }
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            if( !req.body){
                return res.writeHead(400).end(JSON.stringify({
                    reason: `Invalid body`
                }))
            } 
            const { title, description } = req.body
            if (
                !title ||
                !description ||
                title.length <= 1 ||
                description.length <= 1
            ){
                return res.writeHead(400).end(JSON.stringify({
                    reason: `Missing information`
                }))
            }
            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                completed_at: null,
                created_at: new Date().toLocaleString('pt-BR', { timezone: 'America/Sao_Paulo' }),
                updated_at: new Date().toLocaleString('pt-BR', { timezone: 'America/Sao_Paulo' }),
            }
            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        // { title: 'Teste', description: 'Teste' }
        method: 'GET',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const { title, description } = req.query
            let params = {}
            if (title) {
                params.title = title
            }
            if (description) {
                params.description = description
            }
            const tasks = database.select('tasks', Object.keys(params).length > 0 ? params : null)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        // { title: 'Teste', description: 'Teste' }
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const deletar = database.delete('tasks', id)
            if (deletar !== true) {
                return res.writeHead(400).end(JSON.stringify({
                    id: id,
                    reason: `Not found`
                }))
            }
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const title = req.body.title
            const description = req.body.description
            const updated_at = new Date().toLocaleString('pt-BR', { timezone: 'America/Sao_Paulo' })

            const atualizar = database.update('tasks', id, { title, description, updated_at })
            if (atualizar !== true) {
                return res.writeHead(400).end(JSON.stringify({
                    id: id,
                    reason: `Not found`
                }))
            }
            console.log(atualizar)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id/completea'),
        handler: (req, res) => {
            const { id } = req.params
            console.log(JSON.stringify(id))
            const data = new Date().toLocaleString('pt-BR', { timezone: 'America/Sao_Paulo' })
            const updated_at = data
            const task = database.select('tasks', {id})
            console.log(JSON.stringify(task))
            if(task.length > 0  ){
                const id = task[0].id
                let completed_at = task[0].completed_at
                if(completed_at === null ){
                    completed_at = data
                }
                const atualizar = database.update('tasks', id, { completed_at })
                return res.writeHead(201).end()
            } else {
                return res.writeHead(400).end(JSON.stringify({
                    id: id,
                    reason: `Not found`
                }))
            }
        }
    },

]