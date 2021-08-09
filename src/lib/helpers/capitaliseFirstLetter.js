const capitaliseFirstLetter = (string) => {
    let stringArray = string.split('')
    stringArray[0] = stringArray[0].toUpperCase()
    let uppedString = stringArray.join('')
    return uppedString
}

export default capitaliseFirstLetter;