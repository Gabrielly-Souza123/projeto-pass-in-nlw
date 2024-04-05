import { Search, MoreHorizontal, ChevronsLeft, ChevronRight, ChevronLeft, ChevronsRight} from 'lucide-react'
import { IconButton } from './icon-button'
import { TableHeader } from './table/table-header'
import { Table } from './table/table'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState} from 'react'
import  dayjs  from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee{
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList(){


    const [valorDoInput, alteraValorDoInput]  = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('valorDoInput')){
            return Number(url.searchParams.get('valorDoInput') ?? "")
        }

        return ''
})

    const [page, setPage]= useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        }

        return 1
    })


    const [total, setTotal] = useState(0)
    const [attendees, setAttendees]= useState<Attendee[]>([])

    const totalPages = Math.ceil(total / 10)



    
    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');
        url.searchParams.set('pageIndex', String(page - 1));
    
        if (valorDoInput.length > 1) { // <-- Corrigindo a linha
            url.searchParams.set("query", valorDoInput);
        }
    
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setAttendees(data.attendees);
            setTotal(data.total);
        });
    }, [page, valorDoInput]);
    

    function setCurrentPage(page: number){
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

        
    function setAlteraValorDoInput(valorDoInput: string){
        const url = new URL(window.location.toString())
        url.searchParams.set('valorDoInput', valorDoInput)

        window.history.pushState({}, "", url)

        alteraValorDoInput(valorDoInput)
    }

    function goToNextPage(){

        setCurrentPage(page +1)

    }

    function goToPreviousPage(){
        setCurrentPage(page - 1)
    }

    function goToFirtsPage(){
        setCurrentPage(1)
    }

    function goToLastPage(){
        setCurrentPage(totalPages)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
       setAlteraValorDoInput (event.target.value)
        setCurrentPage(1)
    }

    return(
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center"> 
                <h1 className="text-2xl font-bold ">Participantes</h1>
                <div className="px-3 py-1.5 border border-white/10  rounded-lg text-sm w-72 flex items-center gap-3">
                    <Search className='size-4 text-emerald-300'/>
                    <input onChange={onSearchInputChanged} 
                    value={valorDoInput}
                    className="bg-transparent flex-1 outline-none  border-0 p-0 text-sm focus:ring-0" type="text" placeholder="buscar participante" />
                </div>
            </div>
            <Table>
                <thead>
                    <TableRow className='border-b border-white/10'>
                        <TableHeader style={{ width:48 }}>
                            <input type="checkbox" className="size-4 bg-black/20  rounded border border-white/10" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader >Participante</TableHeader>
                        <TableHeader >Data de Inscrição</TableHeader>
                        <TableHeader >Data de check-in</TableHeader>
                        <TableHeader style={{ width:64 }}></TableHeader>
                    </TableRow>
                </thead>
                <tbody>
                    {attendees.map((attendee)=> {
                        return(                    
                            <TableRow key={attendee.id} >
                                <TableCell>
                                    <input type="checkbox" className='size-4 bg-black rounded border border-white/10' />
                                </TableCell>
                                <TableCell >{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>
                                            {attendee.name}
                                            </span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>
                                    {attendee.checkedInAt === null  ? 
                                    (<span className='text-zinc-500'>não fez check-in</span>)
                                     : (
                                        dayjs().to(attendee.checkedInAt))
                                    }
                                </TableCell>
                                <TableCell>
                                <IconButton transparent={true}>
                                    <MoreHorizontal className='size-4'/>
                                </IconButton>
                                </TableCell>
                            </TableRow>
                            )})
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3} >
                            Mostrando {attendees.length} de {total} itens
                        </TableCell>
                        <TableCell colSpan={3} className='py-3 px-4 text-sm text-zinc-300 text-right'>
                        <div className='inline-flex items-center gap-8'>
                            <span>
                                Página {page} de {totalPages}
                            </span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirtsPage} disabled={page === 1}>
                                        <ChevronsLeft className='size-4'/>
                                    </IconButton>
                                        
                                    <IconButton onClick={goToPreviousPage}  disabled={page === 1}> 
                                        <ChevronLeft className='size-4'/>
                                    </IconButton>
                                    
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className='size-4'/>
                                    </IconButton>
                                        
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                            <ChevronsRight className='size-4'/>
                                        </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
                </Table>
            
        </div>
    )
}