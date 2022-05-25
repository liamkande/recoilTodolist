import {
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

// utility for creating unique Id
let id = 0;
function getId() {
    return id++;
}

const todoListState = atom({
    key: 'TodoList',
    default: [],
});

const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});
const charCountState = selector({
    key: 'charCountState', // unique ID (with respect to other atoms/selectors)
    get: ({get}) => {
        const text = get(textState);

        return text.length;
    },
});


function TodoItemCreator() {
    const [inputValue, setInputValue] = useRecoilState(textState);;
    const setTodoList = useSetRecoilState(todoListState);
    const count = useRecoilValue(charCountState);

    const addItem = () => {
        setTodoList((oldTodoList) => [
            ...oldTodoList,
            {
                id: getId(),
                text: inputValue,
                isComplete: false,
            },
        ]);
        setInputValue('');
    };

    const onChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div style={{marginLeft:'9%', marginBottom:50}}>
            <input type="text" value={inputValue} onChange={onChange} style={{width:400}} />
            <button onClick={addItem} disabled={inputValue.length < 4 ? true : false}>Add</button>
            <br/>
            <>Character Count: {count}</>
        </div>
    );
}



function TodoItem({item}) {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);

    const editItemText = ({target: {value}}) => {
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            text: value,
        });

        setTodoList(newList);
    };

    const toggleItemCompletion = () => {
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            isComplete: !item.isComplete,
        });

        setTodoList(newList);
    };

    const deleteItem = () => {
        const newList = removeItemAtIndex(todoList, index);

        setTodoList(newList);
    };

    return (
        <div>
            <input type="text" value={item.text} onChange={editItemText} />
            <input
                type="checkbox"
                checked={item.isComplete}
                onChange={toggleItemCompletion}
            />
            <button onClick={deleteItem}>X</button>
        </div>
    );
}

function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default function TodoList() {
    const todoList = useRecoilValue(todoListState);


    return (
        <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginTop:'10%'}} >
            {/* <TodoListStats /> */}
            {/* <TodoListFilters /> */}
            <TodoItemCreator />
            {todoList.map((todoItem) => (
                    <TodoItem key={todoItem.id} item={todoItem} />
            ))}
        </div>
    );
}