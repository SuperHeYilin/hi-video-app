import React , { Component } from 'react'
import { Tag, Input, Tooltip, Button } from 'antd'

class EditLimitTagGroup extends Component {
    
    state = {
      inputVisible: false,
      inputValue: '',
    };
  
    handleClose = (removedTag) => {
      let { tags : propTags , getTags } = this.props
      let { tags = propTags } = this.state
      tags = tags.filter(tag => tag !== removedTag);
      console.log(tags);
      if(getTags) {
        getTags(tags)
      }
      this.setState({ tags });
    }
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
  
    handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
    }
  
    handleInputConfirm = () => {
      const { tags : propTags , getTags } = this.props
      let { tags = propTags , inputValue } = this.state
      var re = /^\d*$/
      if(!re.test(inputValue)){  
        inputValue = null;  
      }  

      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }

      if(getTags) {
        getTags(tags)
      }
      console.log(tags);
      this.setState({
        tags,
        inputVisible: false,
        inputValue: '',
      });
    }
  
    saveInputRef = input => this.input = input
  
    render() {
      const { tags : propTags } = this.props
      const { tags = propTags, inputVisible, inputValue } = this.state
      return (
        <div>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag+"元"}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>设置金额</Button>}
        </div>
      );
    }
  }

  export default EditLimitTagGroup