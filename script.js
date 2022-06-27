const form = document.querySelector('#form')

const submitButton = document.querySelector('#form button')

const date_input = document.querySelector('#form #date-input')

// This is the function which runs on initial load
// Populates the table with default date
function initial_load() {
  let initial_date = new Date();
  let hours = initial_date.getHours() < 9 ? `0${initial_date.getHours()}` : initial_date.getHours()
  let minutes = initial_date.getMinutes() < 9 ? `0${initial_date.getMinutes()}`
    : initial_date.getMinutes()
   const day = initial_date.getDate()  < 9
    ? `0${initial_date.getDate() }`: initial_date.getDate() ;
  // Add 1 as getMonth starts at 0
  const month = initial_date.getMonth() + 1 < 10
    ? `0${initial_date.getMonth() + 1}`: initial_date.getMonth() + 1;


  const year = initial_date.getFullYear();

  initial_date = `${year}-${month}-${day}T${hours}:${minutes}`

  // Add default date to input element
  date_input.value = `${year}-${month}-${day}T${hours}:${minutes}`


  const lottery_draw_dates = getNextLottoDraw(new Date(initial_date))
  populate_table_data(lottery_draw_dates)
}

function remove_class(class_to_remove) {
  const table_data = document.querySelectorAll('.table-wrapper table tbody td');
  for (let col = 0; col < table_data.length; col++) {
    table_data[col].classList.remove(class_to_remove);
  }
}
date_input.addEventListener('change', function(e) {
  const table_data = document.querySelectorAll('.table-wrapper table tbody td');
  for (let col = 0; col < table_data.length; col++) {
    table_data[col].classList.remove('animate');
    table_data[col].classList.add('disserminate');
  }
})

date_input.addEventListener('click', function(e) {
  // this.showPicker();
})

// Listen for when a user submits the data data
submitButton.addEventListener('click', function (e) {
  e.preventDefault();
  const form_data = new FormData(form)
  const lottery_draw_dates = getNextLottoDraw(new Date(form_data.get('drawDate')));

  populate_table_data(lottery_draw_dates)

})

// Adding date data to the table
function populate_table_data(lottery_draw_dates) {
  const table_data = document.querySelectorAll('.table-wrapper table tbody td');

  const table = document.querySelector('#lottery-table');
  count = 0

  for (let row = 1; row < table.rows.length; row++) {
    for (let col = 0; col < table.rows[row].cells.length; col++){
      table_data[count].classList.remove('disserminate');
      table.rows[row].cells[col].innerHTML = lottery_draw_dates[row - 1][col]
      table_data[count].classList.add('animate');
      count+=1;
    }
  }
}

const formatDate = function(date_to_format) {
  const day = date_to_format.getDate()  < 9
    ? `0${date_to_format.getDate() }`: date_to_format.getDate() ;

  const month = date_to_format.getMonth() < 9
    ? `0${date_to_format.getMonth()}`: date_to_format.getMonth();

  const year = date_to_format.getFullYear();

  return `${day}-${month}-${year}`

}

/*This function generates future and past lottery draw dates,
  given a specific dates */
function getNextLottoDraw(current_date) {
  const next_draw_date = new Date(current_date);
  const future_draw_one = new Date(current_date);
  const future_draw_two = new Date(current_date);
  const past_draw_one = new Date(current_date);
  const past_draw_two = new Date(current_date);

  const day_index = new Date(current_date).getDay()

  switch (true) {
    /*This switch case returns dates if the date is less than Wednesday.
    Wednesday being at index 0. i.e Sun, Mon, Tue */
    case day_index < 3:
      next_draw_date.setDate(current_date.getDate() + 3 - day_index);
      future_draw_one.setDate(current_date.getDate() + 6 - day_index);
      future_draw_two.setDate(current_date.getDate() + 10 - day_index);
      past_draw_one.setDate(current_date.getDate() - 1 - day_index);
      past_draw_two.setDate(current_date.getDate() - 4 - day_index);
      return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
        [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
        [formatDate(future_draw_two), "Future"]]

      break;
    /*This switch case returns future and past dates if
      the given date is greater than Wednesday.
      but less than Saturday ie Thursday and Friday */
    case day_index > 3 && day_index < 6:
      console.log('Thur, Fri - index', day_index)
      next_draw_date.setDate(current_date.getDate() + 6 - day_index);
      future_draw_one.setDate(current_date.getDate() + 10 - day_index);
      future_draw_two.setDate(current_date.getDate() + 13 - day_index);
      past_draw_one.setDate(current_date.getDate() + 3 - day_index);
      past_draw_two.setDate(current_date.getDate() - 1 - day_index);
      return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
        [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
        [formatDate(future_draw_two), "Future"]]
      break;
    /*This switch case returns future and past dates if
      the given date is a Saturday */
      case day_index > 3 && day_index < 6:
    case day_index === 6:
      // Checks if time is past 8pm, sets the date to next day(Sunday)
      if (new Date(current_date).getHours() > 19) {
        next_draw_date.setHours(24, 0, 0, 0, 0)
        future_draw_one.setHours(24, 0, 0, 0, 0)
        future_draw_two.setHours(24, 0, 0, 0, 0)
        past_draw_one.setHours(24, 0, 0, 0, 0)
        past_draw_two.setHours(24, 0, 0, 0, 0)
        // Checks future dates, when date has been reset to Sunday
        next_draw_date.setDate(current_date.getDate() + 4);
        future_draw_one.setDate(current_date.getDate() + 7);
        future_draw_two.setDate(current_date.getDate() + 11);
        past_draw_one.setDate(current_date.getDate());
        past_draw_two.setDate(current_date.getDate() - 3);
        return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
          [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
          [formatDate(future_draw_two), "Future"]]
      } else {
        // Checks future dates, when time is before 8pm on Saturday
        next_draw_date.setDate(current_date.getDate() + 6 - day_index);
        future_draw_one.setDate(current_date.getDate() + 10 - day_index);
        future_draw_two.setDate(current_date.getDate() + 13 - day_index);
        past_draw_one.setDate(current_date.getDate() + 3 - day_index);
        past_draw_two.setDate(current_date.getDate() - 1 - day_index);
        return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
          [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
          [formatDate(future_draw_two), "Future"]]

      }
      break;
     /*This switch case returns future and past dates if
      the given date is a Wednesday */
    case day_index === 3:
      if (new Date(current_date).getHours() > 19) {
        next_draw_date.setHours(24, 0, 0, 0, 0)
        future_draw_one.setHours(24, 0, 0, 0, 0)
        future_draw_two.setHours(24, 0, 0, 0, 0)
        past_draw_one.setHours(24, 0, 0, 0, 0)
        past_draw_two.setHours(24, 0, 0, 0, 0)

        // Checks future dates, when date has been reset to Thursday
        next_draw_date.setDate(current_date.getDate() + 6 - day_index);
        future_draw_one.setDate(current_date.getDate() + 10 - day_index);
        future_draw_two.setDate(current_date.getDate() + 13 - day_index);
        past_draw_one.setDate(current_date.getDate() + 3 - day_index);
        past_draw_two.setDate(current_date.getDate() - 1 - day_index);
        return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
          [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
          [formatDate(future_draw_two), "Future"]]
      } else {

        next_draw_date.setDate(current_date.getDate() + 3 - day_index);
        future_draw_one.setDate(current_date.getDate() + 6 - day_index);
        future_draw_two.setDate(current_date.getDate() + 10 - day_index);
        past_draw_one.setDate(current_date.getDate() - 1 - day_index);
        past_draw_two.setDate(current_date.getDate() - 4 - day_index);
        return [[formatDate(past_draw_two), "Past"], [formatDate(past_draw_one), "Past"],
          [formatDate(next_draw_date), "Future"], [formatDate(future_draw_one), "Future"],
          [formatDate(future_draw_two), "Future"]]

      }
      break;


  }

}

