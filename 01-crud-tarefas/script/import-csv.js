import { parse } from 'csv-parse/sync'
import fs from 'node:fs/promises'

async function lerArquivo() {
    const csv = await fs.readFile('./script/task.csv', 'utf-8')
    const linhas = parse(csv, {
        delimiter: ';',
        columns: true,
        bom: true

    })
    for (let i = 0; i < linhas.length; i++) {
        const { title, description } = linhas[i]
        console.log(title, description)        
        fetch('http://localhost:3333/task', {
            method: 'POST',
            body: JSON.stringify({ 
                title: title,
                description: description
            }),
            duplex: 'half'
        }).then(response => {
            return response.text()
        }).then(data => {
            console.log(data)
        })

    }
}

lerArquivo()