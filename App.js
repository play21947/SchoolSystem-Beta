import './App.css';

import {Route, Switch} from 'react-router-dom'
import Navbar from './components/Navbar';
import Register from './components/Register';
import Choose from './components/Choose';
import Login from './components/Login';
import OwnClass from './components/OwnClass';
import AddSubject from './components/AddSubject'

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/choose" component={Choose}></Route>
        <Route path="/ownclass" component={OwnClass}></Route>
        <Route path="/addsubject" component={AddSubject}></Route>
      </Switch>
    </div>
  );
}

export default App;