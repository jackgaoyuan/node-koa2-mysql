const func1 = () => {
  func2()
}

const func2 = async () => {
  try {
  await func3()
  } catch(e) {
    console.log('error 2')
  }
}

const func3 = async () => {
  return new Promise((resolve, reject) => {
   setTimeout(() => {
     reject('promise reject')
   }, 2000) 
  })
}

func1()