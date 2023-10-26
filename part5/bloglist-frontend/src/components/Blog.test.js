import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Test Blog', () => {
  let container
  const mockUpdateLikes = jest.fn()
  beforeEach(() => {

    const blog = {
      title: 'testing',
      author: 'Paul',
      url: 'www.testingforblog.com',
      likes: 5,
      user: {
        username: 'TESTER',
      }
    }
    container = render(<Blog blog={blog} updateLikes={mockUpdateLikes} />).container
  })

  test('checks that the component displaying a blog renders the title and author, but does not render its URL or number of likes by default.', () => {

    const div = container.querySelector('.togglehide')
    expect(div).toHaveTextContent('testing Paul')
    expect(div).not.toHaveTextContent('www.testingforblog.comlikes')
  })

  test('checks that the URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.toggleshow')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('www.testingforblog.comlikes')
  })

  test('check like button', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    screen.debug(likeButton)
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateLikes.mock.calls).toHaveLength(2)
  })
})
