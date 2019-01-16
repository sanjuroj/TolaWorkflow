import React from 'react'
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

export class VirtualizedMenuList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 35
        });
    }

    render() {
        const {options, children, maxHeight, getValue} = this.props
        const rowCount = children.length || 0

        return (
            <div style={{display: "flex", height: `100vh`, maxHeight: maxHeight+"px"}}>
                <div style={{flex: "1 1 auto"}}>
                    <AutoSizer>
                    {({width, height}) => {
                        return <List
                                height={height}
                                width={width}
                                deferredMeasurementCache={this.cache}
                                rowCount={rowCount}
                                rowHeight={this.cache.rowHeight}
                                noRowsRenderer={() => <div>No selections available</div>}
                                rowRenderer={
                                    ({index, parent, key, style}) =>
                                        <CellMeasurer key={key} cache={this.cache} parent={parent} columnIndex={0} rowIndex={index}>
                                            <div style={style}>{children[index]}</div>
                                        </CellMeasurer>
                                }/>
                    }}
                    </AutoSizer>
                </div>
            </div>
        )
    }
}
