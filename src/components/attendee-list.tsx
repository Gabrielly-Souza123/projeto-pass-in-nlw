import { Search, MoreHorizontal, ChevronsLeft, ChevronRight, ChevronLeft, ChevronsRight} from 'lucide-react'
import { IconButton } from './icon-button'
import { TableHeader } from './table/table-header'
import { Table } from './table/table'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useState} from 'react'
import { attendees } from '../data/attendees'
import  dayjs  from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function AttendeeList(){

    const [valorDoInput, alteraValorDoInput]  = useState('')
    const [page, setPage]= useState(1)
    const totalPages = Math.ceil(attendees.length / 10)

    function goToNextPage(){
        setPage(page + 1)
    }

    function goToPreviousPage(){
        setPage(page - 1)
    }

    function goToFirtsPage(){
        setPage(1)
    }

    function goToLastPage(){
        setPage(totalPages)
    }
    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
        alteraValorDoInput (event.target.value)
        
    }

    return(
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center"> 
                <h1 className="text-2xl font-bold ">Participantes</h1>
                <div className="px-3 py-1.5 border border-white/10  rounded-lg text-sm w-72 flex items-center gap-3">
                    <Search className='size-4 text-emerald-300'/>
                    <input onChange={onSearchInputChanged} className="bg-transparent flex-1 outline-none  border-0 p-0 text-sm ring-0" type="text" placeholder="buscar participante" />
                </div>
            </div>
            <Table>
                <thead>
                    <TableRow className='border-b border-white/10'>
                        <TableHeader style={{ width:48 }}className='py-3 px-4 text-sm font-semibold text-left'>
                            <input type="checkbox" className='size-4 bg-black/20  rounded border border-white/10 ' />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader >Participante</TableHeader>
                        <TableHeader >Data de Inscrição</TableHeader>
                        <TableHeader >Data de check-in</TableHeader>
                        <TableHeader style={{ width:64 }}></TableHeader>
                    {valorDoInput}
                    </TableRow>
                </thead>
                <tbody>
                    {attendees.slice((page - 1) * 10, page *10).map((attendee)=> {
                        return(                    
                            <TableRow  >
                                <TableCell>
                                    <input type="checkbox" className='size-4 bg-black rounded border border-white/10' />
                                </TableCell>
                                <TableCell >{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>
                                <TableCell>
                                {/* <button className='bg-black/20 border border-white/10 rounded-md px-1.5 py-1.5'>
                                    <MoreHorizontal className='size-4'/>
                                </button> */}
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
                            Mostrando 10 de {attendees.length} itens
                        </TableCell>
                        <TableCell colSpan={3} className='py-3 px-4 text-sm text-zinc-300 text-right'>
                        <div className='inline-flex items-center gap-8'>
                            <span>Página {page} de {Math.ceil(attendees.length)}</span>
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
                                        
                                    <IconButton onClick={goToLastPage} disabled={page === 20}>
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