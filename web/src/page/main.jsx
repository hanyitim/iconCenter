import React,{Component,Suspense} from 'react';
import ReactDOM from 'react-dom';
import { Layout, message, Modal } from 'antd';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import {
    routes,
    redirect
} from '@/routes';
import '@/css/base.css';
import './page.normal.less';
//page
// import Index from '@/page/index/index.jsx';
//components
import Sider from '@/components/Sider/index.jsx';

window.Modal = Modal;
window.message = message;
const {Content } = Layout;
class Main extends Component{
    constructor(props) {
        super(props);
        let hash = window.location.hash;
        this.state = {
            selectedKeys:hash,
            updateHash:'',
            refreshDataTimestamp:Date.now(),
            libraryList:[],
            currentLibrary:{}
        };
    }
    updateState = (data) => {
        this.setState(data);
    }
    render(){
        let {refreshDataTimestamp, currentLibrary} = this.state;
        return (
            <Router>
                <Layout className="page" theme="light">
                    <Sider  updateState = {this.updateState}/>
                    <Content className="center">
                        <Switch>
                            <Route exact path="/" render={() => ( <Redirect to={redirect} /> )}/>
                            {
                                routes.map((item,index)=>{
                                    return (
                                        <Route
                                            key={index}
                                            path={item.path}
                                            render={ props => (
                                                <Suspense
                                                    fallback={<p>加载中</p>}
                                                >
                                                    <item.comp {...props} refreshDataTimestamp={refreshDataTimestamp} currentLibrary={currentLibrary} />
                                                </Suspense>
                                            )}
                                        />
                                    );
                                })
                            }
                            <Route render={() => <h1 style={{ textAlign: 'center', marginTop: '160px'}}>迷路了p(´⌒｀｡q) </h1>} />
                        </Switch>
                    </Content>
                </Layout>
            </Router>
        );
    }
}


const render = () =>{
    ReactDOM.render(<Main />, document.getElementById('app'));
};


if(module.hot){
    module.hot.accept('@/page/main.jsx',function(){
        render();
    });
}
render();