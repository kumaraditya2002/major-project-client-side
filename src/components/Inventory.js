import { useEffect ,useState} from 'react'
import { Table,Container,Button,Modal,Form,Row,Col } from 'react-bootstrap';
import Login from './Login';
import NavbarHawker from './NavbarHawker';

const Inventory = () => {
    const [deletedItems,setdeletedItems]=useState([]);
    const [user,setUser]=useState('');
    const [disable,setDisabled]=useState(true);
    const [loading,setLoading]=useState(0);
    const [inv,setInv]=useState([]);
    const [show,setShow]=useState(0);
    const handleClose = () => setShow(!show);
    
    
    useEffect(() => {
        const tkn=localStorage.getItem('user');
        if(tkn)   
            setUser(tkn);
        if(user){
            const getItems = async ()=>{
                setLoading(1);
                const rsp=await fetch('http://localhost:5000/api/hawker/getitem',{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':`bearer ${user}`
                    }
                });
                const data=await rsp.json();
                setLoading(0);
                setInv(data.inv.items);
            }
            getItems();
        }

    },[user]);
    
    const handleSubmit=async (e)=>{
        e.preventDefault();
        console.log(e.target[0].value,e.target[1].value)
        const str1=e.target[0].value,str2=e.target[1].value;
        if(str1==='' || str2==='') alert('Please enter all values');
        else{
            let items=[];
            items.push({name:str1,price:str2});
            const rsp=await fetch('http://localhost:5000/api/hawker/additem',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':`bearer ${user}`
                    },
                    body:JSON.stringify({items})
                });
            const data=await rsp.json();
            // console.log(data);
            setInv(data.items);
        }
    }
    
    const handleDelete=async ()=>{
        setDisabled(true);
        // console.log(deletedItems)
        const rsp=await fetch('http://localhost:5000/api/hawker/deleteitem',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':`bearer ${user}`
                },
                body:JSON.stringify(deletedItems)
            });
        const data=await rsp.json();
        // console.log(data);
        setInv(data.data.items);
    }
    const enableButton=()=>{
        const arr=document.getElementsByClassName('cb');
        let arr1=[]
        Array.from(arr).forEach(e=>{
            if(e.checked)
                arr1.push(e.id);
        })
    
        setdeletedItems(arr1);
        if(arr1.length>0)
            setDisabled(false);
        else
            setDisabled(true);
    }
    if(user==='')
        return <Login/>
    else{
        return (
            <>
                <NavbarHawker/>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Items To your Inventory</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Item Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Item Name"/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicPrice">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Price"/>
                                        </Form.Group>
                                    </Col>
                                    
                                </Row>
                                
                                <Button variant="secondary" onClick={handleClose} className="mx-3">
                                    Close
                                </Button>
                                <Button variant="primary" type="submit"  onClick={handleClose}>
                                    Save Changes
                                </Button>
                            </Form>
                        </Modal.Body>
                    
                </Modal>
                <Container fluid>
                    {loading ? (
                        <h4>Loading...</h4>) :
                        (
                            <Table striped bordered hover style={{"width":"60%","textTransform":"capitalize","textAlign":"center"}} className="mx-auto my-5" >
                                <thead style={{"backgroundColor":"black" ,"color":"white"}}>
                                    <tr>
                                    <th>S.No</th>
                                    <th>Items</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inv.length>0?(
                                        inv.map((e,i)=>{
                                            return (
                                                <tr key={i} id={i+1}>
                                                    <td>{i+1}</td>
                                                    <td>{e.name}</td>
                                                    <td>{e.price}</td>
                                                    <td ><input type="checkbox" id={e._id} onChange={enableButton} className="cb"></input></td>
                                                </tr>
                                            );
                                        })
                                        ):(
                                            <tr><td colSpan='4'><strong>You dont have anything here Please add items</strong></td></tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        )
                    }
                    <div className='mx-auto' style={{"width":"60%","textAlign":"center"}}>    
                        <Button onClick={handleClose} className="m-2">Add Items</Button>
                        <Button className="mx-3" variant="danger" disabled={disable} id="dlt-btn" onClick={handleDelete}>Delete Items</Button>
                    </div>
                </Container>
            </>
        )
    }
}

export default Inventory