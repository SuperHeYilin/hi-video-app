import React, { Component } from 'react';

import SimpleCard from './SimpleCard'
import SecondCard from './SecondCard'
import ThirdCard from './ThirdCard'
import FourthCard from './FourthCard'
import LastRecord from './LastRecord'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            
          }
    }
    componentDidMount() {
        this.setState({ loading: false })
    }

    render() {
       
        return (
            <div>
                <SimpleCard />
                <SecondCard />
                <ThirdCard />
                <FourthCard />
                <LastRecord />
            </div>
        )
    }
}

export default Dashboard