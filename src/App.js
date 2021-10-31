import './App.css';
import SoccerLineUp from 'react-soccer-lineup'
import axios from "axios"
import React, { useState,useEffect } from "react"
import Popup from 'reactjs-popup';
import styled from 'styled-components'
import { useTable, useRowSelect } from 'react-table'

//styling the tables
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
background-color: white;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
//use this as react
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)


function App() {

  //declare variables and utilizing usestate
  const [open, setOpen] = useState(false);
	const [marvel_players,setMarvel_players ] = useState([]);
  const[pos, setPos] = useState([]);
  const [players,setPlayers ] = useState({
    gk: {name: '',  number: "" , color: "",onClick: () => (setPos(['gk',0]), setOpen(true))},
    df: [{name: '' , number: "" , color: "",onClick: () => (setPos(['df', 0]), setOpen(true))},{name: '' , number: "" , color: "",onClick: (e) => (setPos(['df', 1]), setOpen(true))}],
    cm: [{name: '' , number: "" , color: "",onClick: () => (setPos(['cm', 0]), setOpen(true))},{name: '' , number: "" , color: "",onClick: (e) => (setPos(['cm', 1]), setOpen(true))}],
    fw: [ {name: '' , number: "" , color: "",onClick: () => (setPos(['fw', 0]), setOpen(true))}]
  });
  
//API call to obtain characters
	useEffect(() => {
		axios.get("http://gateway.marvel.com/v1/public/characters?orderBy=name&ts=1&apikey=c1678564c654cbe4864dd28bfb060c3c&hash=454bb46d7288894248f2f6f64e46e473&limit=20&offset=0").then(function(response) {
      setMarvel_players(response.data.data.results)
		})

	}, [])


  // const toggleDone = (id) => {
  //   console.log(id);
  //   console.log(pos)

  //   // loop over the todos list and find the provided id.
  //    players.map(item => 
  //     {
  //       console.log(item)
  //       // if (Object.keys(item) == pos[pos[1]]){
  //       //   return {...item, name: id.name}; //gets everything that was already in item, and updates "done"
  //       // }
  //       // return item; // else return unmodified item 
  //     });
  
  //     // setPlayers({players: updatedList}); // set state to new object with updated list
  // }

  
//Selectable table function to display and choose Marvel characters
function Table({ columns, data }) {
  var player1 = {}
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      stateReducer: (newState, action) => {
          if (action.type === "toggleRowSelected") {
            newState.selectedRowIds = {
              [action.id]: true
            }
          }
          return newState;
      },
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

// Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 15).map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      <pre>
{

//update the data and players selected by user
selectedFlatRows.length>0 && pos[0] !=="gk" ? (player1 = players,(player1[pos[0]])[pos[1]] = {name: selectedFlatRows[0].original.name, number: selectedFlatRows[0].id, color: "red"}, setPlayers(player1)): console.log('No selection')
, selectedFlatRows.length>0 && pos[0] ==="gk" ? (player1 = players,(player1[pos[0]] = {name: selectedFlatRows[0].original.name, number: selectedFlatRows[0].id, color: "red"}, setPlayers(player1))) : console.log('No selection')

}
      </pre>
    </>
  )
}

//Create columns with character's name and description
const columns = React.useMemo(
  () => [
        {
          Header: "Character's name",
          accessor: 'name',
        }
  ],
  []
)


  return (
    <div className="App" >
      <div style={{background: "red"}}>
  <h1 style={{color: "white"}}>Marvel Soccer Team</h1>
</div>
  <div>
    {/* Use soccer lineup library */}
        <SoccerLineUp
          size={ "responsive" }
          color={ "#588f58" }
          pattern={ "lines" }
          homeTeam={{ squad: players, style: {color: "#f08080", numberColor: "#ffffff", nameColor: "#ffffff"}}}
        />
  {/* Pop table when user click on player */}
  <Popup
  open={open}
  onClose={() => setOpen(false)}
    >
      {close => (
        <div className="modal"style={{background: "white"}}>
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header" style={{background: "white"}}> Choose a Marvel Player:  </div>
          <div style={{background: "white"}}>
      <Styles>
        <Table columns={columns} data={marvel_players} />
      </Styles>

          </div>
        </div>
      )}
    </Popup>

    </div>
</div>

  );
}

export default App;
