import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm creates a blog and calls the event handler', async () => {
  const mockCreateBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={mockCreateBlog} />)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')

  const createButton = screen.getByText('create')

  await user.type(inputTitle, 'testingBlogForm')
  await user.type(inputAuthor, 'tester')
  await user.type(inputUrl, 'www.testing.com')

  await user.click(createButton)
  screen.debug(inputAuthor)

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0].title).toBe('testingBlogForm')
  expect(mockCreateBlog.mock.calls[0][0].author).toBe('tester')
  expect(mockCreateBlog.mock.calls[0][0].url).toBe('www.testing.com')
})