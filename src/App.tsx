import React, {Component} from 'react';
import './App.css';
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";
import {Layout} from "antd";
import Menu from "antd/es/menu";
import {Mixer} from "./components/Mixer";
import {Jobcoin} from "./components/Jobcoin";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Layout className="layout">
                    <Layout.Header style={{zIndex: 1, width: '100%'}}>
                        <div className="logo"/>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1">Jobcoin Mixer</Menu.Item>
                        </Menu>
                    </Layout.Header>
                    <Layout.Content style={{padding: '50px 50px 0px 50px'}}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Jobcoin
                                />
                            </Col>
                            <Col span={12}>
                                <Mixer
                                />
                            </Col>
                        </Row>
                    </Layout.Content>
                    <Layout.Footer style={{textAlign: 'center'}}>Raayan Pillai © 2019</Layout.Footer>
                </Layout>
            </div>
        );
    }
}

export default App;