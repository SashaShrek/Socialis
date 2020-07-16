class Hello extends React.Component{
    render(){
        return <p>Hi{this.props.name}</p>;
    }
}
ReactDOM.render(
    <Hello name=", my friend"/>,
    document.getElementById("root")
)